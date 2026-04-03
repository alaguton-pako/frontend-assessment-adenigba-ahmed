# Pokémon Explorer - Frontend Assessment

## Setup Instructions

1. Clone repository
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000`

## Architecture Decisions

- **API Choice**: PokéAPI - no API key required, stable, rich data
- **Pagination over Infinite Scroll**: Cleaner SSR, better cache headers
- **ISR with revalidate: 3600**: Static generation + hourly refresh for performance
- **Native fetch without TanStack Query**: All filtering is client-side on initial dataset

## Performance Optimizations Applied

1. `next/image` with priority loading
2. ISR caching (`revalidate: 3600`)
3. Dynamic imports for client components

## Trade-offs & Known Limitations

- Client-side filtering only works on loaded page (not across entire dataset)
- PokéAPI image URLs are stable but sprite quality varies

## Deployment

[Live URL to be added after deployment]