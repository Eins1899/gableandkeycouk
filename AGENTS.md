<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Estimate input validation, the IP limit predicate and email field rows are shared in a browser-safe module; both submission paths use one server-only non-fatal Resend helper to prevent divergence.
- Privacy and terms are separate content routes using a shared legal-page layout; each content route defines its own metadata.
- Keep media source-controlled for external hosting; omit image metadata when the page only has bundled relative images.
