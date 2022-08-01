# Conjugator

Using the `Conjugate` class

> new Conjugate([options])

the `options` argument defaults to a random values picked from

> split( "tenses" | "subjects" | "verbs" )

## Example:

```js
let options = {
  tense: "pr",
  subject: "Il / Elle / On",
  verb: "Aller",
};
console.log(new Conjugate(options));
```

#### Returns

```json
{
  "subject": "elle",
  "verb": "Aller",
  "tense": "Présent",
  "tenseShort": "pr",
  "answer": {
    "alt": "va",
    "full": "elle va"
  },
  "definition": "to go",
  "mascot": "Walk"
}
```
