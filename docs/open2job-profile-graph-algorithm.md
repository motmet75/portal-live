# Open2Job profile graph draft

## Goal

Store one candidate profile once, then present it through any number of root criteria. The first roots are `timeline`, `achievement`, and `people`. Adding a root must not require duplicating profile content.

## Core records

- `candidate_profile`: owner, slug, headline, summary, visibility, password hash, moderation status.
- `profile_node`: a reusable career item such as experience, project, achievement, education, certificate, gallery item, or video.
- `profile_edge`: connects two nodes and describes the relationship (`worked_with`, `produced`, `part_of`, `earned`, `mentions`).
- `profile_person`: a lightweight mentioned collaborator. It does not require an Open2Job account.
- `profile_node_person`: joins a node to a mentioned person with role and display order.
- `profile_criterion`: a configurable root definition with key, label, grouping rule, sorting rule, and enabled state.
- `profile_media`: image or approved YouTube reference attached to a node.

## Read algorithm

1. Load the candidate and all approved, visible nodes in one bounded query.
2. Load edges, people, and media in batch queries; never query per card.
3. Build an in-memory adjacency map keyed by node ID.
4. Resolve the selected criterion:
   - `timeline`: sort nodes by end date, start date, then display order.
   - `achievement`: select nodes with measurable outcomes, rank featured items first, then impact weight.
   - `people`: invert `profile_node_person`, group nodes under each mentioned person, then rank by latest shared work.
5. Convert groups into a presentation DTO containing root, group, card, and edge arrays.
6. Limit the initial graph to a configured number of cards. Fetch the next cursor only when requested.
7. Cache the public DTO by `profileId + criterion + version`. Invalidate by incrementing the profile version after an approved edit.

## Supporting N criteria

Each criterion implements the same interface:

```text
select(nodes, edges) -> nodes
group(selected) -> groups
sort(groups, nodes) -> ordered groups and cards
decorate(cards) -> labels, metrics, and visual hints
```

This permits later roots such as project, skill, organization, location, or media without changing stored profile nodes.

## PostgreSQL and traffic notes

- Index public profile lookup on `(slug, moderation_status, visibility)`.
- Index nodes on `(profile_id, moderation_status, start_date desc)`.
- Index both directions of edges and joins.
- Store only media metadata and object-storage URLs in PostgreSQL.
- Return compact DTOs; load media thumbnails lazily.
- Use cursor pagination rather than offset pagination for large profiles.
- Cache public profiles at Nginx/CDN and application level with versioned keys.
- Password-protected responses must never be placed in a public cache.
