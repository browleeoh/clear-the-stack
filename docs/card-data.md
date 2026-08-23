# Card data and attribution

The generated HOB catalog is sourced from the [Scryfall API](https://scryfall.com/docs/api). Scryfall provides card data and imagery under its published API use guidelines and the Wizards of the Coast Fan Content Policy.

The source registry records the exact Scryfall API query and retrieval date used for
the catalog. Scryfall is the catalog and Oracle-text data provider; Wizards of the
Coast remains the publisher of Magic's rules. Before authoring or re-verifying card
guidance, refresh the catalog if needed and check the current Wizards Comprehensive
Rules effective date and the relevant normalized source locators.

Clear the Stack uses this data to provide additional beginner-focused explanations and gameplay scenarios. Access to card data is not paywalled, and the project does not imply endorsement by Scryfall or Wizards of the Coast.

The importer sends an application-specific `User-Agent` and an `Accept` header, performs a bounded search for the 193 numbered HOB main-set cards, and writes only the fields needed by the application. Run it with:

```bash
npm run import:hob
```

The catalog may contain optional links to unmodified full-card images hosted by Scryfall. Image files are not included in this repository or added to offline caching. The application must remain usable when an image link is missing or unavailable. Card images, card names, rules text, illustrations, and other Magic: The Gathering materials are property of Wizards of the Coast and their respective artists.

Relevant policies and documentation:

- [Scryfall API overview and usage rules](https://scryfall.com/docs/api)
- [Scryfall card imagery guidance](https://scryfall.com/docs/api/images)
- [Scryfall rate limits and caching guidance](https://scryfall.com/docs/api/rate-limits)
- [Wizards of the Coast Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy)
