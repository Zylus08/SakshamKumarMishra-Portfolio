# Big Five chatbot — M3 audit

Reviewed 2026-11-09. Public-source findings are pinned below. **Verified** means observed in source or API metadata; **documented** means asserted by an upstream artifact; **reproduced** is reserved for checks actually run. Source review is not a production certification. Private read authorization does not authorize public disclosure of private implementation or research.

Reviewed snapshot: [Zylus08/big5-chatbot at b09a90640dcf](https://github.com/Zylus08/big5-chatbot/tree/b09a90640dcf81e96c7004b465bcc0594efd5e35).

## Implementation and evidence

A FastAPI application connects survey routes, an interview session, structured LLM output, an embedding-based comparator, and SQLite persistence. Conversation history and facet coverage are maintained outside the model chain.

The public agent uses a prompt, Groq-backed model, and Pydantic output parser. It tracks facet coverage and limits repeated probing. The axis scorer subtracts low-pole from high-pole exemplar embeddings, projects responses onto that direction, and maps the result to a bounded scale.

## Results and limitations

VERIFIED by source inspection: external session state, structured parsing, contrastive exemplar scoring, and transcript persistence exist. A separately audited private revision is not published here and is not represented as a second project.

Exemplar calibration is not population validation. No clinical diagnosis, reliability estimate, or validated psychological inference is established. The public version's client-supplied session identifiers and persistent transcripts require privacy and authorization review before use. Stored participant data was not read or copied.

## Detailed review

The public original and authorized private revision are treated as one project lineage. The public portfolio describes only public evidence; no private implementation, research artifact, transcript, or credential is copied. The private revision is not a second project, a published product release, or a source of publicly asserted security guarantees.

The public interview agent calls Groq and parses structured responses with Pydantic. External interview state tracks facet coverage; the inspected logic limits questions across 30 facets. The axis scorer compares high/low anchors and rescales values into a project-defined 1–5 range. Such scores are not a standardized clinical or psychometric instrument.

Public storage code persists interviews and results. The inspected public route surface accepts client-supplied session identifiers; ownership checks and deletion/retention policies require review before a hosted service. No saved user database was opened and no live model call was made. Prompt controls and schema parsing alone do not establish injection resistance or psychological validity.

Next work before stronger claims: publish an approved redacted technical summary if desired, evaluate against a validated instrument with appropriate study design, document consent and retention, verify session ownership and rate limits end-to-end, and separate mocked tests from live-provider validation. No acceptance, clinical effectiveness, or independent security certification is claimed.

## Sources

- [src/agent/interview_agent.py](https://github.com/Zylus08/big5-chatbot/blob/b09a90640dcf81e96c7004b465bcc0594efd5e35/src/agent/interview_agent.py)
- [src/embeddings/axis_scorer.py](https://github.com/Zylus08/big5-chatbot/blob/b09a90640dcf81e96c7004b465bcc0594efd5e35/src/embeddings/axis_scorer.py)
- [src/db/database.py](https://github.com/Zylus08/big5-chatbot/blob/b09a90640dcf81e96c7004b465bcc0594efd5e35/src/db/database.py)
- [app.py](https://github.com/Zylus08/big5-chatbot/blob/b09a90640dcf81e96c7004b465bcc0594efd5e35/app.py)
