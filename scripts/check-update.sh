#!/usr/bin/env bash

DEBUG="${PROJECT_BUTLER_UPDATE_CHECK_DEBUG:-0}"

resolve_skill_dir() {
  if [[ -n "${1:-}" ]]; then
    printf '%s\n' "$1"
    return 0
  fi

  if [[ -n "${PROJECT_BUTLER_SKILL_DIR:-}" ]]; then
    printf '%s\n' "$PROJECT_BUTLER_SKILL_DIR"
    return 0
  fi

  if [[ -n "${BASH_SOURCE[0]:-}" ]]; then
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd -P)"
    if [[ -n "$script_dir" ]]; then
      printf '%s\n' "$(cd "$script_dir/.." 2>/dev/null && pwd -P)"
      return 0
    fi
  fi

  local git_root
  git_root="$(git rev-parse --show-toplevel 2>/dev/null)"
  if [[ -n "$git_root" ]]; then
    printf '%s\n' "$git_root"
    return 0
  fi

  printf '%s\n' "$HOME/.claude/skills/project-butler"
}

quote_cd_path() {
  printf '%q' "$1"
}

# Banner language follows the current project's CLAUDE.md "Language:" field
# (en / zh / bilingual). Falls back to en when there is no readable marker, so
# English projects and non-Claude-Code tools are unaffected.
detect_lang() {
  [[ -f ./CLAUDE.md ]] || { printf 'en\n'; return; }
  local token
  token="$(grep -iE 'Language:' ./CLAUDE.md | head -1 | grep -oiE '(bilingual|zh|en)' | head -1 | tr '[:upper:]' '[:lower:]')"
  case "$token" in
    zh|bilingual|en) printf '%s\n' "$token" ;;
    *) printf 'en\n' ;;
  esac
}

# Subcommand: --pull <dir> — the "Update now" action. Try a fast fetch + ff-only
# pull; on any failure (offline, SSH port 22 blocked, or local changes) fall back
# to printing the manual command plus an HTTPS alternative.
if [[ "${1:-}" == "--pull" ]]; then
  PULL_DIR="$(resolve_skill_dir "${2:-}")"
  if GIT_SSH_COMMAND="ssh -o ConnectTimeout=5 -o BatchMode=yes" GIT_TERMINAL_PROMPT=0 \
       git -C "$PULL_DIR" pull --ff-only -q origin main 2>/dev/null; then
    echo "UPDATE_OK: project-butler updated to the latest version."
  else
    ORIGIN="$(git -C "$PULL_DIR" remote get-url origin 2>/dev/null)"
    HTTPS_URL="$(printf '%s' "$ORIGIN" | sed -E 's#^git@([^:]+):#https://\1/#')"
    echo "UPDATE_FAILED: could not pull automatically (offline, SSH blocked, or local changes)."
    echo "  Run manually: cd $(quote_cd_path "$PULL_DIR") && git pull"
    [[ -n "$HTTPS_URL" && "$HTTPS_URL" != "$ORIGIN" ]] && \
      echo "  SSH blocked? Use HTTPS: git -C $(quote_cd_path "$PULL_DIR") pull $HTTPS_URL main"
  fi
  exit 0
fi

SKILL_DIR="$(resolve_skill_dir "${1:-}")"

if [[ "${PROJECT_BUTLER_NO_UPDATE_CHECK:-}" == "1" ]]; then
  [[ "$DEBUG" == "1" ]] && echo "[update-check] silenced by env var" >&2
  exit 0
fi

if [[ -z "$SKILL_DIR" ]]; then
  [[ "$DEBUG" == "1" ]] && echo "[update-check] no SKILL_DIR; skipping" >&2
  exit 0
fi

CACHE="$SKILL_DIR/.claude/.version-check.txt"
NOW="$(date +%s)"
NEED_FETCH=1
BEHIND=0
CURRENT_SHA="$(git -C "$SKILL_DIR" rev-parse HEAD 2>/dev/null)"

if [[ -f "$CACHE" ]]; then
  LAST_CHECK="$(grep '^last_check=' "$CACHE" | cut -d= -f2-)"
  CACHED_BEHIND="$(grep '^behind_by=' "$CACHE" | cut -d= -f2-)"
  CACHED_SHA="$(grep '^head_sha=' "$CACHE" | cut -d= -f2-)"
  # Seed from a SHA-valid cached count so a later fetch failure (offline / port 22
  # blocked) falls back to the last known value instead of silently reporting 0.
  if [[ "$CACHED_SHA" == "$CURRENT_SHA" && "$CACHED_BEHIND" =~ ^[0-9]+$ ]]; then
    BEHIND="$CACHED_BEHIND"
  fi
  # Skip the fetch only when the cache is also time-fresh. The numeric guard on
  # LAST_CHECK keeps a corrupt cache from leaking an arithmetic error to stderr.
  if [[ "$LAST_CHECK" =~ ^[0-9]+$ && $((NOW - LAST_CHECK)) -lt 86400 && "$CACHED_SHA" == "$CURRENT_SHA" ]]; then
    NEED_FETCH=0
    [[ "$DEBUG" == "1" ]] && echo "[update-check] cache fresh; BEHIND=$BEHIND" >&2
  fi
fi

if [[ "$NEED_FETCH" -eq 1 ]]; then
  if GIT_SSH_COMMAND="ssh -o ConnectTimeout=5 -o BatchMode=yes" GIT_TERMINAL_PROMPT=0 git -C "$SKILL_DIR" fetch -q origin main 2>/dev/null; then
    BEHIND="$(git -C "$SKILL_DIR" rev-list --count HEAD..origin/main 2>/dev/null || echo 0)"
    CURRENT_SHA="$(git -C "$SKILL_DIR" rev-parse HEAD 2>/dev/null)"
    mkdir -p "$(dirname "$CACHE")" 2>/dev/null
    printf 'last_check=%s\nbehind_by=%s\nhead_sha=%s\n' "$NOW" "$BEHIND" "${CURRENT_SHA:-}" > "$CACHE" 2>/dev/null
    [[ "$DEBUG" == "1" ]] && echo "[update-check] fetch ok; BEHIND=$BEHIND" >&2
  else
    [[ "$DEBUG" == "1" ]] && echo "[update-check] fetch failed; using cached BEHIND=$BEHIND" >&2
  fi
fi

if [[ "${BEHIND:-0}" -gt 0 ]]; then
  # 24h notification throttle: surface the update prompt at most once per day so it
  # does not appear on every invocation. Claude Code turns this VERSION_NOTICE into
  # an interactive update question; shell / Cursor / Codex users read it directly.
  PROMPT_STATE="$SKILL_DIR/.claude/.version-prompt"
  LAST_PROMPTED=0
  [[ -f "$PROMPT_STATE" ]] && LAST_PROMPTED="$(cat "$PROMPT_STATE" 2>/dev/null)"
  [[ "$LAST_PROMPTED" =~ ^[0-9]+$ ]] || LAST_PROMPTED=0
  if [[ $((NOW - LAST_PROMPTED)) -ge 86400 ]]; then
    mkdir -p "$(dirname "$PROMPT_STATE")" 2>/dev/null
    printf '%s\n' "$NOW" > "$PROMPT_STATE" 2>/dev/null
    CD_CMD="cd $(quote_cd_path "$SKILL_DIR") && git pull"
    case "$(detect_lang)" in
      zh)
        echo "VERSION_NOTICE: project-butler 已落后上游 ${BEHIND} 个提交。"
        echo "  → 更新: ${CD_CMD}"
        ;;
      bilingual)
        echo "VERSION_NOTICE: project-butler is ${BEHIND} commits behind upstream. / 已落后上游 ${BEHIND} 个提交。"
        echo "  → Update / 更新: ${CD_CMD}"
        ;;
      *)
        echo "VERSION_NOTICE: project-butler is ${BEHIND} commits behind upstream."
        echo "  → Update: ${CD_CMD}"
        ;;
    esac
  else
    [[ "$DEBUG" == "1" ]] && echo "[update-check] within 24h prompt throttle; suppressing" >&2
  fi
fi
