def escape_like(term: str, escape_char: str = "\\") -> str:
    """Escape user-controlled wildcards for SQL LIKE patterns.

    Escapes %, _ and the escape character itself. Works with SQLAlchemy's
    Column.like(pattern, escape=escape_char).
    """
    if term is None:
        return ""
    return (
        term.replace(escape_char, escape_char + escape_char)
        .replace("%", escape_char + "%")
        .replace("_", escape_char + "_")
    )


def build_like_pattern(term: str, position: str = "both", escape_char: str = "\\") -> str:
    """Build a LIKE pattern around an escaped term.

    position: 'prefix' (term%), 'suffix' (%term), 'both' (%term%), 'exact' (term)
    """
    safe = escape_like(term, escape_char)
    if position == "prefix":
        return f"{safe}%"
    if position == "suffix":
        return f"%{safe}"
    if position == "exact":
        return safe
    return f"%{safe}%"


