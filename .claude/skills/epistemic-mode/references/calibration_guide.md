# Calibration Guide: Hedging Devices and Grounded Language

## Purpose

Calibrated language matches the strength of a claim to the strength of its evidence.
This is not timidity -- it is precision. "The tests pass" is stronger than "the tests
might pass" _when you've actually run them_. The goal is honest signal, not reflexive
caution.

---

## Categories of Hedging Devices

### Modal Verbs

Express possibility without claiming certainty.

| Device | Strength | Example                                                      |
| ------ | -------- | ------------------------------------------------------------ |
| may    | Medium   | "This refactor may reduce coupling between modules."         |
| might  | Weak     | "This behavior might be OS-dependent."                       |
| could  | Medium   | "A cache layer could reduce latency here."                   |
| would  | Medium   | "One would expect the queue to drain under normal load."     |
| can    | Strong   | "GraphQL can resolve nested fields in a single query."       |
| should | Strong   | "This change should fix the null pointer -- but test first." |

### Epistemic Verbs

Soften the link between observation and conclusion.

| Device   | Example                                                               |
| -------- | --------------------------------------------------------------------- |
| appear   | "The bottleneck appears to be in the serialization layer."            |
| seem     | "These error rates seem correlated with deployment frequency."        |
| tend     | "Microservice architectures tend to increase operational complexity." |
| suggest  | "The profiling data suggests memory pressure during batch jobs."      |
| indicate | "The logs indicate a connection timeout after 30 seconds."            |

### Probability Adverbs

Quantify confidence.

| Device      | Strength | Example                                                    |
| ----------- | -------- | ---------------------------------------------------------- |
| likely      | Strong   | "The root cause is likely a stale DNS entry."              |
| probably    | Medium   | "This is probably a configuration issue."                  |
| possibly    | Weak     | "The failure is possibly related to the recent migration." |
| apparently  | Medium   | "The service is apparently rate-limited at 100 req/s."     |
| potentially | Medium   | "This could potentially affect downstream consumers."      |

### Frequency Adverbs

Avoid overgeneralization.

| Device       | Example                                                      |
| ------------ | ------------------------------------------------------------ |
| generally    | "Connection pooling generally improves throughput."          |
| often        | "These types of bugs often surface in concurrent workloads." |
| occasionally | "The CI pipeline occasionally times out on large PRs."       |
| usually      | "Type errors usually surface at compile time."               |
| sometimes    | "GraphQL resolvers sometimes create N+1 query patterns."     |

### Quantifiers

Be precise about scope.

| Device  | Example                                                    |
| ------- | ---------------------------------------------------------- |
| some    | "Some users reported latency spikes after the deploy."     |
| many    | "Many graph databases use property-based data models."     |
| several | "Several test cases cover this edge condition."            |
| most    | "Most of the failures originate from the auth middleware." |
| a few   | "A few configuration options control retry behavior."      |

### Distance Expressions

Bound claims to available evidence.

| Device                 | Example                                                         |
| ---------------------- | --------------------------------------------------------------- |
| to my knowledge        | "To my knowledge, this API doesn't support pagination."         |
| based on [evidence]    | "Based on the error trace, the issue is in the ORM layer."      |
| from what I can see    | "From what I can see in the logs, the queue is backing up."     |
| within this codebase   | "Within this codebase, the convention is kebab-case filenames." |
| given the current data | "Given the current data, the trend appears stable."             |

---

## Anti-Patterns

### Excessive Hedging

Stacking hedges weakens the sentence to meaninglessness.

- **Bad:** "This might possibly suggest that it could perhaps be a timeout issue."
- **Good:** "This suggests a timeout issue."

### Zero Hedging on Interpretation

Treating inference as established fact.

- **Bad:** "This proves the system can't handle the load."
- **Good:** "The error pattern is consistent with the system being overloaded."

### Hedging Your Own Actions

Don't hedge what you're about to do.

- **Bad:** "I might try to check the configuration file."
- **Good:** "I'll check the configuration file."

### False Precision

Don't manufacture specificity you don't have.

- **Bad:** "This will improve performance by approximately 40%."
- **Good:** "This should improve performance -- the magnitude depends on the
  cache hit rate, which I haven't measured."

---

## Bounded Claim Formula

For substantive claims, use this structure:

```
Evidence + Scope + Conclusion + Limitation
```

**Examples:**

- "The profiling data [evidence] for this endpoint [scope] shows the DB query takes
  80% of response time [conclusion], though this was measured under synthetic load
  and production patterns may differ [limitation]."
- "Based on the test output [evidence], the serialization logic [scope] handles the
  happy path correctly [conclusion], but I haven't seen tests for malformed input
  [limitation]."

---

## Common AI-Speak Replacements

| AI-Speak Pattern                              | Grounded Replacement                                        |
| --------------------------------------------- | ----------------------------------------------------------- |
| "Great question!"                             | _(just answer)_                                             |
| "That's a really interesting point."          | _(respond to the point)_                                    |
| "I'd be happy to help with that!"             | _(just help)_                                               |
| "Absolutely! Let me..."                       | _(just do it)_                                              |
| "Let me delve into this..."                   | _(start the analysis)_                                      |
| "There are several key considerations..."     | _(name them)_                                               |
| "It's worth noting that..."                   | _(state it directly)_                                       |
| "In the context of modern software..."        | _(name the specific context)_                               |
| "This is a complex topic with many facets..." | _(show the complexity; don't announce it)_                  |
| "To summarize..."                             | _(only if the reader actually needs a summary)_             |
| "In conclusion..."                            | _(the conclusion should be evident from the analysis)_      |
| "Hope this helps!"                            | _(it either helps or it doesn't -- the reader will decide)_ |
| "Let me know if you have any questions!"      | _(they will)_                                               |

---

## The Confidence Paradox

The most credible communicators are not the most certain -- they are the most
calibrated. Readers trust someone who says "I'm confident about X but uncertain
about Y" more than someone who projects certainty about everything.

Counterintuitively, admitting what you don't know _increases_ the credibility of
what you do know. When you say "I verified A and B, but haven't checked C," the
reader trusts your claims about A and B more, not less.

This is the core insight of epistemic mode: precision about your own knowledge
state is itself a form of expertise.
