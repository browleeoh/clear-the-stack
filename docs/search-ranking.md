# Search ranking

The local MiniSearch index boosts titles (`4`) ahead of aliases (`2.5`); descriptions
and explanatory text retain MiniSearch's default weight. Prefix matching remains
enabled. Fuzzy matching uses MiniSearch's `0.22` threshold for queries of four or more
characters.

For one- to three-character queries, search is restricted to card titles with prefix
matching and no fuzzy matching. This keeps short card-name lookups such as `tho`
focused on Thorin rather than incidental rules-text fragments. Longer natural-language
questions continue to search every indexed field.
