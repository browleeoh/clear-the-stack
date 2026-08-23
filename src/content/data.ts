import {
  cardSchema,
  contentDataSchema,
  conceptSchema,
  sourceSchema,
  sourceLocatorSchema,
  type Card,
  type Concept,
  type Source,
  type SourceLocator,
} from './schema'

const rawSources = [
  {
    id: 'magic-comprehensive-rules',
    title: 'Magic: The Gathering Comprehensive Rules',
    publisher: 'Wizards of the Coast',
    url: 'https://media.wizards.com/2026/downloads/MagicCompRules%2020260819.txt',
    sourceType: 'comprehensive-rules',
    retrievedAt: '2026-08-22',
    rulesEffectiveDate: '2026-08-07',
    version: 'MagicCompRules 20260819 text release',
  },
  {
    id: 'scryfall-hob-catalog',
    title: 'Scryfall Cards API — HOB Main-Set Catalog Query',
    publisher: 'Scryfall, LLC',
    url: 'https://api.scryfall.com/cards/search?q=e%3Ahob%20cn%3C%3D193&unique=prints&order=set',
    sourceType: 'oracle-text',
    retrievedAt: '2026-08-22',
  },
  {
    id: 'hob-release-notes',
    title: 'Magic: The Gathering | The Hobbit Release Notes',
    publisher: 'Wizards of the Coast',
    url: 'https://magic.wizards.com/en/news/feature/the-hobbit-release-notes',
    sourceType: 'release-notes',
    retrievedAt: '2026-08-22',
  },
  {
    id: 'hob-mechanics',
    title: 'Magic: The Gathering | The Hobbit Mechanics',
    publisher: 'Wizards of the Coast',
    url: 'https://magic.wizards.com/en/news/feature/the-hobbit-mechanics',
    sourceType: 'official-mechanics',
    retrievedAt: '2026-08-22',
  },
  {
    id: 'hob-update-bulletin',
    title: 'Magic: The Gathering | The Hobbit Update Bulletin',
    publisher: 'Wizards of the Coast',
    url: 'https://magic.wizards.com/en/news/announcements/the-hobbit-update-bulletin',
    sourceType: 'update-bulletin',
    retrievedAt: '2026-08-22',
  },
  {
    id: 'hob-prerelease-guide',
    title: 'Magic: The Gathering | The Hobbit Prerelease Guide',
    publisher: 'Wizards of the Coast',
    url: 'https://magic.wizards.com/en/news/feature/the-hobbit-prerelease-guide',
    sourceType: 'official-guide',
    retrievedAt: '2026-08-22',
  },
] satisfies Source[]

const rawSourceLocators = [
  { id: 'cr-rule-122-1', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 122.1 — Counters are markers, not objects or tokens' },
  { id: 'cr-rule-122-1j', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 122.1j — Hone counters' },
  { id: 'cr-rule-122-2', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 122.2 — Counters across zone changes' },
  { id: 'cr-rule-113-3c', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 113.3c — Triggered abilities' },
  { id: 'cr-rule-113-7a', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 113.7a — Ability independent of its source' },
  { id: 'cr-rule-117-4', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 117.4 — Passing priority before resolution' },
  { id: 'cr-rule-115-1', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 115.1 — Choosing targets' },
  { id: 'cr-rule-115-1d', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 115.1d — Targets of triggered abilities' },
  { id: 'cr-rule-115-6', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 115.6 — Allowing zero targets' },
  { id: 'cr-rule-301-5', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rules 301.5–301.5a — Equipment and equipped creatures' },
  { id: 'cr-rule-301-5b', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 301.5b — Attaching Equipment' },
  { id: 'cr-rule-301-5c', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 301.5c — Legal Equipment attachments' },
  { id: 'cr-rule-701-3', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 701.3 — Attach and unattach' },
  { id: 'cr-rule-702-6a', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 702.6a — Equip' },
  { id: 'cr-rule-603-1', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 603.1 — Trigger condition and effect' },
  { id: 'cr-rule-603-2', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 603.2 — Triggering does not perform the effect' },
  { id: 'cr-rule-603-3', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rules 603.3 and 603.3d — Putting triggered abilities on the stack' },
  { id: 'cr-rule-603-3b', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 603.3b — Priority after triggered abilities are stacked' },
  { id: 'cr-rule-608-2b', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 608.2b — Rechecking targets and partial resolution' },
  { id: 'cr-rule-608-2c', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 608.2c — Following instructions in order' },
  { id: 'cr-rule-701-70', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 701.70 — Recruit' },
  { id: 'cr-rule-702-195', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 702.195 — Storied' },
  { id: 'hob-release-notes-storied', sourceId: 'hob-release-notes', locatorType: 'named-section', label: 'New Keyword Ability: Storied' },
  { id: 'hob-release-notes-recruit', sourceId: 'hob-release-notes', locatorType: 'named-section', label: 'New Keyword Action: Recruit' },
  { id: 'hob-release-notes-hone-counters', sourceId: 'hob-release-notes', locatorType: 'named-section', label: 'New Mechanic: Hone Counters' },
  { id: 'hob-release-notes-amass', sourceId: 'hob-release-notes', locatorType: 'named-section', label: 'Returning Keyword Action: Amass' },
  { id: 'hob-release-notes-landfall', sourceId: 'hob-release-notes', locatorType: 'named-section', label: 'Returning Ability Word: Landfall' },
  { id: 'hob-mechanics-storied', sourceId: 'hob-mechanics', locatorType: 'named-section', label: 'Storied' },
  { id: 'hob-mechanics-recruit', sourceId: 'hob-mechanics', locatorType: 'named-section', label: 'Recruit' },
  { id: 'hob-mechanics-hone-counters', sourceId: 'hob-mechanics', locatorType: 'named-section', label: 'Hone Counters' },
  { id: 'hob-mechanics-amass', sourceId: 'hob-mechanics', locatorType: 'named-section', label: 'Amass' },
  { id: 'hob-update-bulletin-new-rules', sourceId: 'hob-update-bulletin', locatorType: 'named-section', label: 'New and Updated Rules' },
  { id: 'hob-release-notes-thorin', sourceId: 'hob-release-notes', locatorType: 'mechanic-example', label: 'Thorin Oakenshield — example in New Keyword Ability: Storied (no card-specific entry)', cardOracleId: 'bdd41af0-bbd1-4ecd-a699-99f006f5e5ce' },
  { id: 'hob-release-notes-bifur', sourceId: 'hob-release-notes', locatorType: 'card-specific-entry', label: 'Bifur, Melodic Rider', cardOracleId: 'b8d563e4-e2bc-4e8b-8841-6655beff9138' },
  { id: 'hob-release-notes-bard-king', sourceId: 'hob-release-notes', locatorType: 'card-specific-entry', label: 'Bard, King of Dale', cardOracleId: 'd05db2c1-a19a-4803-8e8a-fa2f9b798181' },
  { id: 'hob-release-notes-celebrate', sourceId: 'hob-release-notes', locatorType: 'card-specific-entry', label: 'Celebrate the Mountain-king', cardOracleId: 'd51136fa-3c13-48a5-83fd-51fe00010a4b' },
  { id: 'hob-release-notes-dwalin', sourceId: 'hob-release-notes', locatorType: 'mechanic-example', label: 'Dwalin, Weaponmaster — example in New Mechanic: Hone Counters (no card-specific entry)', cardOracleId: 'cee583b7-7cc3-40ea-a227-b760839ec291' },
  { id: 'hob-release-notes-sting', sourceId: 'hob-release-notes', locatorType: 'no-card-specific-entry', label: "Sting, Bilbo's Sword — no card-specific release-note entry", cardOracleId: '9779f32c-b1a2-42a3-8e78-14c28c3ad254' },
  { id: 'hob-release-notes-bolg', sourceId: 'hob-release-notes', locatorType: 'card-specific-entry', label: 'Bolg of the North', cardOracleId: '88522a0f-5377-4522-97f4-4148bef954af' },
  { id: 'hob-release-notes-azog', sourceId: 'hob-release-notes', locatorType: 'card-specific-entry', label: "Azog, Moria's Ruin", cardOracleId: 'a8b018a7-0350-4ee0-9582-8d391018bdee' },
  { id: 'hob-release-notes-nasty-little-rabbit', sourceId: 'hob-release-notes', locatorType: 'card-specific-entry', label: 'Nasty Little Rabbit', cardOracleId: 'ee86cce6-c7c1-40a6-896b-cde9b86bb532' },
  { id: 'hob-release-notes-silvan-reveler', sourceId: 'hob-release-notes', locatorType: 'no-card-specific-entry', label: 'Silvan Reveler — no card-specific release-note entry', cardOracleId: '11932191-4b19-49b1-bfe4-abb7b83b2e59' },
] satisfies SourceLocator[]

export const concepts: Concept[] = conceptSchema.array().parse([
  {
    id: 'hone-counters',
    name: 'Hone Counters',
    kind: 'set-mechanic',
    aliases: [
      'hone counter',
      'honing equipment',
      'sharpen equipment',
      'equipment power bonus',
      'does hone work unattached',
      'multiple hone counters',
      'move honed equipment',
      'equipment loses abilities',
    ],
    summary:
      'Each hone counter on an Equipment gives +1/+0 to the creature that Equipment is attached to. The counter stays on the Equipment, so the bonus follows that Equipment to whichever creature it equips.',
    memoryAid:
      'Count the hone counters on the Equipment; give that much power to its equipped creature.',
    officialText:
      '122.1j A hone counter on an Equipment gives +1/+0 to any creature that Equipment is attached to.',
    easyToMiss: [
      'The bonus comes from the counter itself, not from an ability printed on the Equipment.',
      'Hone counters remain on an unattached Equipment, but they give no creature a bonus until it is attached again.',
      'Each counter gives its own +1/+0. Two hone counters give the equipped creature +2/+0.',
      'If the Equipment moves, the old creature loses the bonus and the newly equipped creature gets it immediately.',
      'Removing the counters, unattaching the Equipment, or making it leave the battlefield ends the corresponding bonus immediately.',
    ],
    relatedConceptIds: ['counter', 'equipment', 'attachment'],
    sourceIds: [
      'cr-rule-122-1j',
      'hob-release-notes-hone-counters',
      'hob-mechanics-hone-counters',
    ],
    verificationStatus: 'verified',
    scenarios: [
      {
        id: 'hone-one-counter-simple-example',
        title: 'One counter on an equipped Equipment',
        setup: [
          'A 2/2 creature is equipped with an Equipment.',
          'That Equipment has one hone counter on it.',
        ],
        question: 'What are the creature’s power and toughness?',
        answer: 'explanation',
        explanation:
          'It is 3/2 before any other effects. The hone counter gives the equipped creature +1/+0.',
        commonMistake:
          'Adding toughness too. A hone counter changes power only.',
        tags: ['simple example', 'one counter', 'power', 'toughness'],
        sourceIds: [
          'cr-rule-122-1j',
          'hob-release-notes-hone-counters',
          'hob-mechanics-hone-counters',
        ],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-22',
      },
      {
        id: 'hone-multiple-counters',
        title: 'Multiple hone counters add together',
        setup: [
          'A creature is equipped with one Equipment.',
          'That Equipment has three hone counters on it.',
        ],
        question: 'How large is the hone-counter bonus?',
        answer: 'explanation',
        explanation:
          'The creature gets +3/+0. Each of the three counters gives +1/+0.',
        commonMistake:
          'Giving only +1/+0 because the Equipment has hone counters at all.',
        tags: ['multiple counters', 'counting', 'power'],
        sourceIds: [
          'cr-rule-122-1j',
          'hob-release-notes-hone-counters',
          'hob-mechanics-hone-counters',
        ],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-22',
      },
      {
        id: 'hone-unattached-equipment',
        title: 'The Equipment is unattached',
        setup: [
          'An Equipment with two hone counters is on the battlefield.',
          'It is not attached to a creature.',
        ],
        question: 'Do the counters disappear or give a creature a bonus?',
        answer: 'explanation',
        explanation:
          'The counters stay on the Equipment, but no creature gets a bonus while it is unattached. If it later becomes attached, its equipped creature gets +2/+0.',
        commonMistake:
          'Removing the counters just because the Equipment became unattached.',
        tags: ['unattached', 'equipment', 'counters remain'],
        sourceIds: [
          'cr-rule-122-1j',
          'hob-release-notes-hone-counters',
          'hob-mechanics-hone-counters',
        ],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-22',
      },
      {
        id: 'hone-move-equipment',
        title: 'Move the Equipment to another creature',
        setup: [
          'An Equipment with two hone counters is attached to creature A.',
          'That Equipment becomes attached to creature B instead.',
        ],
        question: 'Which creature gets the hone-counter bonus?',
        answer: 'explanation',
        explanation:
          'Creature A immediately loses +2/+0, and creature B immediately gets +2/+0. The counters stay on the Equipment and apply to the creature it is currently attached to.',
        commonMistake:
          'Leaving the bonus on the creature that used to be equipped.',
        tags: ['move equipment', 'attach', 'unattach', 'immediate'],
        sourceIds: [
          'cr-rule-122-1j',
          'hob-release-notes-hone-counters',
          'hob-mechanics-hone-counters',
        ],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-22',
      },
      {
        id: 'hone-equipment-loses-abilities',
        title: 'The Equipment loses its abilities',
        setup: [
          'An Equipment with two hone counters is attached to a creature.',
          'An effect makes the Equipment lose its abilities without unattaching it.',
        ],
        question: 'Does the creature still get +2/+0?',
        answer: 'yes',
        explanation:
          'The creature still gets +2/+0. The bonus comes from the rules for hone counters, not from an ability on the Equipment.',
        commonMistake:
          'Treating the counter’s effect as an ability that the Equipment can lose.',
        tags: ['loses abilities', 'equipment', 'counter rules'],
        sourceIds: [
          'cr-rule-122-1j',
          'hob-release-notes-hone-counters',
          'hob-mechanics-hone-counters',
        ],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-22',
      },
      {
        id: 'hone-remove-or-leave',
        title: 'Remove counters or remove the Equipment',
        setup: [
          'An Equipment with two hone counters is attached to a creature.',
          'Either both counters are removed or the Equipment leaves the battlefield.',
        ],
        question: 'Does the creature keep +2/+0?',
        answer: 'no',
        explanation:
          'The bonus ends immediately. Removed counters can no longer give a bonus, and Equipment that left the battlefield is no longer attached to the creature.',
        commonMistake:
          'Keeping the power increase until end of turn after its source is gone.',
        tags: ['remove counters', 'leaves battlefield', 'immediate'],
        sourceIds: [
          'cr-rule-122-1j',
          'hob-release-notes-hone-counters',
          'hob-mechanics-hone-counters',
        ],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-22',
      },
    ],
  },
  {
    id: 'counter',
    name: 'Counter',
    kind: 'game-concept',
    aliases: [
      'counters',
      'what is a counter',
      'counter vs token',
      'do counters stay',
      'counter leaves battlefield',
      'marker on a card',
    ],
    summary:
      'A counter is a marker placed on a game object or player. Its name tells you which rule, ability, or effect gives it meaning; a hone counter matters because the rules give hone counters a specific effect on Equipment.',
    memoryAid: 'A counter marks something; it is not a separate game object or token.',
    officialText:
      '122.1 A counter is a marker placed on an object or player that modifies its characteristics and/or interacts with a rule, ability, or effect. Counters are not objects and have no characteristics.',
    easyToMiss: [
      'A counter is not a token. A Treasure token is a permanent; a hone counter is only a marker on an Equipment.',
      'Counters with the same name are interchangeable, so count every hone counter on an Equipment.',
      'Counters stay on a permanent when it becomes attached or unattached because it has not changed zones.',
      'If the object moves to another zone, its counters cease to exist rather than following it.',
    ],
    relatedConceptIds: ['hone-counters', 'equipment', 'attachment', 'token'],
    sourceIds: ['cr-rule-122-1', 'cr-rule-122-2', 'cr-rule-122-1j'],
    verificationStatus: 'verified',
    scenarios: [
      {
        id: 'counter-not-a-token',
        title: 'A counter is not another permanent',
        setup: [
          'You put a hone counter on an Equipment you control.',
          'An effect asks how many permanents or artifact tokens you control.',
        ],
        question: 'Does the hone counter add one to that count?',
        answer: 'no',
        explanation:
          'The counter is only a marker on the Equipment. It is not an object, permanent, artifact, or token of its own.',
        commonMistake: 'Counting a counter as though it were a token permanent.',
        tags: ['counter', 'token', 'permanent', 'artifact', 'counting'],
        sourceIds: ['cr-rule-122-1'],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-23',
      },
      {
        id: 'counter-zone-change',
        title: 'The marked object leaves the battlefield',
        setup: [
          'An Equipment has two hone counters on it.',
          'That Equipment leaves the battlefield and later returns.',
        ],
        question: 'Does the returned Equipment still have those counters?',
        answer: 'no',
        explanation:
          'The counters cease to exist when the Equipment changes zones. The returned Equipment does not keep them.',
        commonMistake: 'Moving the old counters onto the returned Equipment.',
        tags: ['counter', 'zone change', 'leaves battlefield', 'returns'],
        sourceIds: ['cr-rule-122-2'],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-23',
      },
    ],
  },
  {
    id: 'equipment',
    name: 'Equipment',
    kind: 'object',
    aliases: [
      'equipment card',
      'equipment object',
      'equip ability',
      'equipment vs equip',
      'does equipment enter attached',
      'move equipment',
    ],
    summary:
      'Equipment is an artifact subtype. An Equipment can be attached to one creature, while equip is just one activated ability that can attach it; a spell or another ability can attach Equipment without using equip.',
    memoryAid: 'Equipment is the object; equip is an ability that can move it.',
    officialText:
      '301.5 Some artifacts have the subtype “Equipment.” An Equipment can be attached to a creature. 702.6a Equip is an activated ability of Equipment cards.',
    easyToMiss: [
      'Casting an Equipment does not cast its equip ability, and Equipment normally enters unattached.',
      'Equip targets a creature you control and can normally be activated only as a sorcery.',
      'An effect that says “attach” can attach Equipment directly; it does not pay or activate the equip ability.',
      'Equipment remains a separate permanent while attached. It does not become part of the creature.',
      'An Equipment can equip only one creature at a time.',
    ],
    relatedConceptIds: ['attachment', 'counter', 'hone-counters'],
    sourceIds: [
      'cr-rule-301-5',
      'cr-rule-301-5b',
      'cr-rule-301-5c',
      'cr-rule-702-6a',
    ],
    verificationStatus: 'verified',
    scenarios: [
      {
        id: 'equipment-enters-unattached',
        title: 'Casting Equipment does not equip a creature',
        setup: [
          'You cast an Equipment spell and it resolves.',
          'Nothing else says to attach it as it enters.',
        ],
        question: 'Is it automatically attached to one of your creatures?',
        answer: 'no',
        explanation:
          'It enters as an unattached artifact. You may later activate its equip ability at a legal time, or another spell or ability may attach it.',
        commonMistake: 'Treating “Equipment” as an instruction to attach it when it enters.',
        tags: ['equipment', 'cast', 'enters', 'unattached', 'equip ability'],
        sourceIds: ['cr-rule-301-5b', 'cr-rule-702-6a'],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-23',
      },
      {
        id: 'equipment-attach-without-equip',
        title: 'An effect attaches Equipment directly',
        setup: [
          'An ability says to attach an Equipment to a creature you control.',
          'The Equipment also has a printed equip cost.',
        ],
        question: 'Must you pay the equip cost?',
        answer: 'no',
        explanation:
          'Follow the resolving ability and attach the Equipment. The equip cost is paid only when activating the separate equip ability.',
        commonMistake: 'Charging an equip cost whenever any effect attaches Equipment.',
        tags: ['equipment', 'attach', 'equip cost', 'ability', 'resolution'],
        sourceIds: ['cr-rule-301-5b', 'cr-rule-702-6a'],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-23',
      },
    ],
  },
  {
    id: 'attachment',
    name: 'Attachment',
    kind: 'game-concept',
    aliases: [
      'attach',
      'attached',
      'unattached',
      'move attached equipment',
      'what happens to old creature',
      'illegal attachment',
    ],
    summary:
      'To attach an Equipment is to move that separate permanent onto a creature it can legally equip. Moving it to another creature automatically ends the old attachment.',
    memoryAid: 'One Equipment, one legal creature; moving it replaces the old attachment.',
    officialText:
      '701.3a To attach an Aura, Equipment, or Fortification means to take it from where it currently is and put it onto that object or player.',
    easyToMiss: [
      'Attaching does not create a new Equipment or merge it with the creature.',
      'Attaching an Equipment to a different creature makes it unattached from the previous creature.',
      'If an effect tries to attach Equipment to something it cannot legally equip, the Equipment does not move.',
      'An unattached Equipment stays on the battlefield.',
    ],
    relatedConceptIds: ['equipment', 'counter', 'hone-counters'],
    sourceIds: ['cr-rule-301-5c', 'cr-rule-701-3'],
    verificationStatus: 'verified',
    scenarios: [
      {
        id: 'attachment-moves-equipment',
        title: 'Move Equipment to another creature',
        setup: [
          'An Equipment is attached to creature A.',
          'A legal effect attaches that Equipment to creature B.',
        ],
        question: 'Is the Equipment attached to both creatures?',
        answer: 'no',
        explanation:
          'The Equipment moves to creature B and becomes unattached from creature A. An Equipment can equip only one creature.',
        commonMistake: 'Leaving the Equipment attached to both creatures.',
        tags: ['attach', 'unattach', 'move equipment', 'one creature'],
        sourceIds: ['cr-rule-301-5c', 'cr-rule-701-3'],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-23',
      },
      {
        id: 'attachment-illegal-object',
        title: 'The proposed attachment is illegal',
        setup: [
          'An Equipment is attached to one creature.',
          'An effect tries to attach it to an object that it cannot legally equip.',
        ],
        question: 'Does the Equipment move?',
        answer: 'no',
        explanation:
          'The attempted attachment does nothing, so the Equipment stays where it is. An attach effect cannot move Equipment onto an illegal object.',
        commonMistake: 'Unattaching the Equipment even though the attempted move was illegal.',
        tags: ['attach', 'illegal', 'equipment', 'does not move'],
        sourceIds: ['cr-rule-301-5b', 'cr-rule-701-3'],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-23',
      },
    ],
  },
  {
    id: 'triggered-ability',
    name: 'Triggered Ability',
    kind: 'game-concept',
    aliases: [
      'trigger',
      'triggered ability',
      'when whenever at',
      'enter trigger',
      'attack trigger',
      'trigger vs effect',
      'when does the effect happen',
    ],
    summary:
      'A triggered ability starts with “when,” “whenever,” or “at.” The matching event makes it trigger automatically, but its effect waits on the stack and happens only if the ability resolves.',
    memoryAid: 'The event triggers the ability now; the effect happens later on resolution.',
    officialText:
      '603.1 Triggered abilities have a trigger condition and an effect. 603.2 When the event matches, the ability triggers automatically but does nothing at that point.',
    easyToMiss: [
      'An enters or attacks event makes the ability trigger; it does not immediately perform the instructions after the comma.',
      'The triggered ability is put on the stack the next time a player would receive priority.',
      'Targets for a triggered ability are chosen when the ability is put on the stack, not when its source first triggers.',
      'Removing the source after the ability is on the stack does not remove that ability from the stack.',
    ],
    relatedConceptIds: ['target', 'resolution'],
    sourceIds: [
      'cr-rule-113-3c',
      'cr-rule-113-7a',
      'cr-rule-117-4',
      'cr-rule-603-1',
      'cr-rule-603-2',
      'cr-rule-603-3',
      'cr-rule-603-3b',
    ],
    verificationStatus: 'verified',
    scenarios: [
      {
        id: 'trigger-effect-waits',
        title: 'The event happens before the effect',
        setup: [
          'A permanent has “Whenever this creature attacks, put a counter on an Equipment.”',
          'That creature attacks.',
        ],
        question: 'Is the counter placed before the triggered ability resolves?',
        answer: 'no',
        explanation:
          'Attacking makes the ability trigger. The ability goes on the stack, players may respond, and the counter is placed only if the ability resolves.',
        canRespond:
          'Yes. Players receive priority after the triggered ability is put on the stack and before it resolves.',
        commonMistake: 'Treating the trigger event and its later effect as one immediate action.',
        tags: ['trigger', 'effect', 'attacks', 'stack', 'respond'],
        sourceIds: [
          'cr-rule-113-3c',
          'cr-rule-117-4',
          'cr-rule-603-2',
          'cr-rule-603-3',
          'cr-rule-603-3b',
        ],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-23',
      },
      {
        id: 'trigger-source-leaves',
        title: 'The source leaves after triggering',
        setup: [
          'An enters triggered ability has been put on the stack.',
          'Its source leaves the battlefield before that ability resolves.',
        ],
        question: 'Does the triggered ability disappear with its source?',
        answer: 'no',
        explanation:
          'The ability is already a separate object on the stack. It can still resolve even though its source left the battlefield.',
        commonMistake: 'Removing an ability from the stack when its source leaves.',
        tags: ['triggered ability', 'source leaves', 'stack', 'resolution'],
        sourceIds: ['cr-rule-113-3c', 'cr-rule-113-7a', 'cr-rule-603-3'],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-23',
      },
    ],
  },
  {
    id: 'target',
    name: 'Target',
    kind: 'game-concept',
    aliases: [
      'targeting',
      'choose a target',
      'target opponent',
      'up to one target',
      'choose no creature',
      'legal target',
      'illegal target',
    ],
    summary:
      'A target is a player or object chosen for a spell or ability that uses the word “target.” For a triggered ability, legal targets are chosen when that ability is put on the stack.',
    memoryAid: 'Find the word “target,” choose legally when it goes on the stack, then check again on resolution.',
    officialText:
      '115.1 Targets are declared while a spell or ability is put on the stack. 115.1d A triggered ability is targeted when it identifies something with “target.”',
    easyToMiss: [
      'A required target must be legal when chosen; you cannot choose something just because it may become legal later.',
      '“Up to one target” permits choosing either one legal target or no target for that phrase.',
      'Choosing no target for an optional “up to one” phrase is different from choosing a target that later becomes illegal.',
      'Targets are checked again when the spell or ability tries to resolve.',
    ],
    relatedConceptIds: ['triggered-ability', 'resolution'],
    sourceIds: [
      'cr-rule-115-1',
      'cr-rule-115-1d',
      'cr-rule-115-6',
      'cr-rule-608-2b',
    ],
    verificationStatus: 'verified',
    scenarios: [
      {
        id: 'target-triggered-ability-choice',
        title: 'Choose targets when the trigger goes on the stack',
        setup: [
          'An ability that says “target opponent” triggers.',
          'The ability is about to be put on the stack.',
        ],
        question: 'When is the opponent chosen?',
        answer: 'explanation',
        explanation:
          'Choose a legal opponent as the triggered ability is put on the stack, before any player responds to that ability.',
        commonMistake: 'Waiting until resolution to choose a printed target.',
        tags: ['target opponent', 'triggered ability', 'stack', 'choice'],
        sourceIds: ['cr-rule-115-1', 'cr-rule-115-1d', 'cr-rule-603-3'],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-23',
      },
      {
        id: 'target-up-to-one-none',
        title: 'Choose no optional creature target',
        setup: [
          'A triggered ability includes “up to one target creature you control.”',
          'You do not want to choose a creature.',
        ],
        question: 'May you choose zero creatures for that phrase?',
        answer: 'yes',
        explanation:
          '“Up to one” allows zero. The ability can still have and affect any other required target named elsewhere in its text.',
        commonMistake: 'Treating “up to one” as though exactly one target were required.',
        tags: ['up to one', 'zero targets', 'choose no creature'],
        sourceIds: ['cr-rule-115-6'],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-23',
      },
    ],
  },
  {
    id: 'resolution',
    name: 'Resolution',
    kind: 'game-concept',
    aliases: [
      'resolve ability',
      'resolution',
      'check targets again',
      'target became illegal',
      'all targets illegal',
      'partial resolution',
      'does the rest happen',
    ],
    summary:
      'When a spell or ability resolves, it rechecks its targets and then follows its instructions in order. If every target is illegal it does not resolve; if at least one remains legal, it resolves without affecting illegal targets and does as much of the rest as possible.',
    memoryAid: 'Recheck every target; one legal target keeps the ability resolving.',
    officialText:
      '608.2b Recheck targets as a spell or ability resolves. If all are illegal, it does not resolve; otherwise it resolves normally without affecting illegal targets.',
    easyToMiss: [
      'Target legality can change between the time an ability goes on the stack and the time it resolves.',
      'All targets illegal means none of the instructions happen.',
      'One or more legal targets means the ability resolves, but illegal targets are not affected and cannot supply required information.',
      'Instructions are followed in the order written; players do not act in the middle of one resolving ability unless instructed.',
    ],
    relatedConceptIds: ['triggered-ability', 'target'],
    sourceIds: ['cr-rule-608-2b', 'cr-rule-608-2c'],
    verificationStatus: 'verified',
    scenarios: [
      {
        id: 'resolution-all-targets-illegal',
        title: 'Every chosen target becomes illegal',
        setup: [
          'A triggered ability has one or more chosen targets.',
          'Every chosen target is illegal when the ability would resolve.',
        ],
        question: 'Do any of the ability’s instructions happen?',
        answer: 'no',
        explanation:
          'The ability does not resolve because all its targets are illegal. None of its effects happen.',
        commonMistake: 'Performing untargeted-looking instructions from an ability whose every target is illegal.',
        tags: ['all targets illegal', 'does not resolve', 'resolution'],
        sourceIds: ['cr-rule-608-2b'],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-23',
      },
      {
        id: 'resolution-one-target-illegal',
        title: 'One target stays legal and one becomes illegal',
        setup: [
          'A triggered ability targets an opponent and a creature you control.',
          'The opponent remains legal, but the creature is illegal when the ability resolves.',
        ],
        question: 'Does the ability still resolve?',
        answer: 'yes',
        explanation:
          'The legal opponent keeps the ability resolving. It can use and affect that opponent as instructed, but it does not affect the illegal creature; the other instructions still happen as far as possible in written order.',
        commonMistake: 'Stopping the entire ability because only one of multiple targets became illegal.',
        tags: ['partial resolution', 'one legal target', 'illegal creature'],
        sourceIds: ['cr-rule-608-2b', 'cr-rule-608-2c'],
        verificationStatus: 'verified',
        reviewedAt: '2026-08-23',
      },
    ],
  },
  {
    id: 'storied',
    name: 'Storied',
    kind: 'keyword-ability',
    aliases: [
      'enduring story',
      'do treasure tokens count',
      'artifact tokens count',
      'counts twice',
      'three permanents',
    ],
    summary:
      'While you control a permanent with storied, controlling three or more qualifying permanents gives you an enduring story for the rest of the game.',
    memoryAid:
      'Three qualifying permanents, not three qualities—and tokens are permanents.',
    officialText:
      'Storied (If you control three or more artifacts, legendaries, and/or Sagas, you have an enduring story for the rest of the game.)',
    easyToMiss: [
      'Tokens count. A Treasure or other artifact token is a permanent.',
      'One permanent counts only once, even if it is both legendary and an artifact.',
      'You need to control a permanent with storied when you meet the requirement.',
      'Once earned, your enduring story cannot be removed—even if every qualifying permanent leaves.',
      'Storied is not a triggered ability and does not use the stack.',
    ],
    relatedConceptIds: ['permanent', 'token', 'artifact', 'legendary', 'saga'],
    sourceIds: ['hob-release-notes', 'hob-mechanics'],
    verificationStatus: 'verified',
    scenarios: [
      {
        id: 'storied-tokens-count',
        title: 'Do artifact tokens count?',
        setup: [
          'You control Thorin Oakenshield.',
          'You control a Treasure token.',
          'You control an Axe artifact token.',
        ],
        question: 'Do you have an enduring story?',
        answer: 'yes',
        explanation:
          'Thorin is legendary, and both tokens are artifact permanents. That gives you three separate qualifying permanents.',
        commonMistake: 'Assuming that only nontoken cards can qualify.',
        tags: ['token', 'artifact', 'treasure', 'counting'],
        sourceIds: ['hob-release-notes'],
        verificationStatus: 'verified',
      },
      {
        id: 'storied-overlapping-types',
        title: 'Does a legendary artifact count twice?',
        setup: [
          'You control a permanent with storied.',
          'You control one legendary artifact.',
          'You control one Saga.',
        ],
        question: 'Have you reached three qualifying permanents?',
        answer: 'no',
        explanation:
          'You control only two qualifying permanents. The legendary artifact has two qualifying characteristics, but it remains one permanent.',
        commonMistake: 'Counting qualities instead of separate permanents.',
        tags: ['legendary', 'artifact', 'saga', 'counting'],
        sourceIds: ['hob-release-notes'],
        verificationStatus: 'verified',
      },
      {
        id: 'storied-response-window',
        title: 'Can an opponent respond to you getting the story?',
        setup: [
          'You control a permanent with storied and two qualifying permanents.',
          'Your third qualifying permanent is on the stack.',
        ],
        question: 'When can an opponent act?',
        answer: 'explanation',
        explanation:
          'An opponent can respond to the spell before it resolves. Once the third permanent is on the battlefield and you meet the condition, earning the enduring story does not use the stack and cannot be responded to.',
        canRespond:
          'Yes—before the third permanent resolves, but not after you already control it and earn the designation.',
        tags: ['respond', 'stack', 'priority', 'timing'],
        sourceIds: ['hob-release-notes'],
        verificationStatus: 'verified',
      },
    ],
  },
  {
    id: 'permanent',
    name: 'Permanent',
    kind: 'game-concept',
    aliases: ['objects on battlefield', 'what is a permanent'],
    summary:
      'A permanent is an object on the battlefield, including creatures, artifacts, enchantments, lands, planeswalkers, battles, and tokens.',
    memoryAid: 'If it is on the battlefield, it is usually a permanent.',
    easyToMiss: ['Spells on the stack and emblems are not permanents.'],
    relatedConceptIds: ['token'],
    sourceIds: ['hob-release-notes'],
    scenarios: [],
    verificationStatus: 'verified',
  },
  {
    id: 'token',
    name: 'Token',
    kind: 'object',
    aliases: ['treasure', 'food', 'soldier token', 'artifact token'],
    summary:
      'A token is a marker representing a permanent that was created by a spell or ability rather than played as a card.',
    memoryAid: 'Tokens on the battlefield are permanents too.',
    easyToMiss: ['A token can be an artifact, creature, or both.'],
    relatedConceptIds: ['permanent', 'artifact'],
    sourceIds: ['hob-release-notes'],
    scenarios: [],
    verificationStatus: 'verified',
  },
])

export const cards: Card[] = cardSchema.array().parse([
  {
    id: 'thorin-oakenshield',
    oracleId: 'bdd41af0-bbd1-4ecd-a699-99f006f5e5ce',
    setCode: 'HOB',
    collectorNumber: '165',
    name: 'Thorin Oakenshield',
    manaCost: '{R}{W}',
    typeLine: 'Legendary Creature — Dwarf Noble',
    oracleText:
      'Trample\nStoried (If you control three or more artifacts, legendaries, and/or Sagas, you have an enduring story for the rest of the game.)\nAs long as you have an enduring story, artifacts and creatures you control have ward {1}.',
    power: '3',
    toughness: '2',
    summary:
      'Thorin counts toward his own storied requirement because he is legendary. After you earn an enduring story, he protects your artifacts and creatures with ward {1}.',
    conceptIds: ['storied', 'permanent'],
    easyToMiss: [
      'Thorin himself is one qualifying permanent because he is legendary.',
      'Artifact tokens can supply the other two qualifying permanents.',
      'Your enduring story remains if Thorin leaves, but Thorin’s ward effect does not.',
      'Ward applies to both artifacts and creatures you control; an artifact creature still receives one instance from Thorin.',
    ],
    sourceIds: ['hob-release-notes'],
    scenarios: [
      {
        id: 'thorin-leaves',
        title: 'What happens if Thorin leaves?',
        setup: [
          'You earned an enduring story while controlling Thorin.',
          'Thorin then leaves the battlefield.',
        ],
        question: 'Do you keep the story and ward?',
        answer: 'depends',
        explanation:
          'You keep the enduring story because the designation is on you for the rest of the game. You lose Thorin’s ward-granting effect because that ability only functions while Thorin is on the battlefield.',
        tags: ['ward', 'leaves battlefield', 'enduring story'],
        sourceIds: ['hob-release-notes'],
        verificationStatus: 'verified',
      },
    ],
    verificationStatus: 'verified',
  },
])

export function validateContentData(data: unknown) {
  return contentDataSchema.parse(data)
}

const validatedContentData = validateContentData({
  sources: sourceSchema.array().parse(rawSources),
  sourceLocators: sourceLocatorSchema.array().parse(rawSourceLocators),
  concepts,
  cards,
})

export const sources = validatedContentData.sources
export const sourceLocators = validatedContentData.sourceLocators

const sourcesById = new Map(sources.map((source) => [source.id, source]))
const sourceLocatorsById = new Map(
  sourceLocators.map((locator) => [locator.id, locator]),
)

export function getSource(id: string) {
  return sourcesById.get(id)
}

export function resolveSourceReference(id: string) {
  const source = sourcesById.get(id)
  if (source) return { id, source }

  const locator = sourceLocatorsById.get(id)
  if (!locator) return undefined

  const parentSource = sourcesById.get(locator.sourceId)
  if (!parentSource) return undefined

  return { id, source: parentSource, locator }
}

export function getConcept(id: string) {
  return concepts.find((concept) => concept.id === id)
}

export function getCard(id: string) {
  return cards.find((card) => card.id === id)
}

const cardsByOracleId = new Map(cards.map((card) => [card.oracleId, card]))

export function getCardByOracleId(oracleId: string) {
  return cardsByOracleId.get(oracleId)
}
