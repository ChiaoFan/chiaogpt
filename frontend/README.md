# ChiaoGPT frontend

React chat UI for [ChiaoGPT](../README.md), a personal RAG chatbot. Built with Vite, TypeScript, Tailwind CSS v4, and shadcn/ui.

**Live demo:** [https://chiaogpt.chiaofan.co/](https://chiaogpt.chiaofan.co/)

For the full system (API, retrieval pipeline, architecture, tech stack), see the [project README](../README.md).

## Commands

```
npm install      # install dependencies
npm run dev       # start the dev server
npm run build      # type-check and build for production
npm run lint         # run oxlint
npm run preview        # preview the production build locally
```

## Environment

The API endpoint defaults to the deployed Lambda URL hardcoded in `src/lib/api.ts`. To point at a different backend, set `VITE_API_URL` in a `.env` file at build time.
