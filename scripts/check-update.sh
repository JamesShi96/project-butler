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
  if [[ -n "$LAST_CHECK" && $((NOW - LAST_CHECK)) -lt 86400 && "$CACHED_SHA" == "$CURRENT_SHA" ]]; then
    NEED_FETCH=0
    BEHIND="$CACHED_BEHIND"
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
  echo "VERSION_NOTICE: project-butler is ${BEHIND} commits behind upstream."
  echo "  → Update: cd $(quote_cd_path "$SKILL_DIR") && git pull"
  echo "  → Silence: PROJECT_BUTLER_NO_UPDATE_CHECK=1"
fi
