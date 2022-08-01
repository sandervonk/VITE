# Conjugator Options

> Conjugate.constructor([options])

#### inputs:

##### {options}

- Keyed object containing:
  - {options}**.tense**
    - Shortened abbreviation of a tense:
      - _pr_ - Présent
      - _pc_ - Passé Composé
      - _pp_ - Plus que Parfait
      - _im_ - Imparfait
      - _co_ - Conditionnel
      - _ps_ - Passé Simple
      - _fs_ - Futur Simple
      - _fa_ - Futur Antérieur
      - _cp_ - Conditionnel Passé
      - _su_ - Subjonctif
      - _sp_ - Subjonctif Passé
  - {options}**.subject**
    - String representation of a subject group (" / " between if multiple)
      - "Je"
      - "Tu"
      - "Il / Elle / On"
      - "Nous"
      - "Vous"
      - "Ils / Elles"
  - {options}**.verb**
    - string of a verb (should match a key in `verbs.json`)

> Conjugate.agreement(subjects)

Used for adding agreement to needed conjugations. Only called when they should be added

#### inputs:

##### "subjects"

- String of one of the following:
  - "Je"
  - "Tu"
  - "Il / Elle / On"
  - "Nous"
  - "Vous"
  - "Ils / Elles"

#### {output}

- Keyed object containing:
  - {output}**.subject**
    - input if singular, otherwise random from split of " / "
  - {output}**.agreement**
    - string of agreement characters (sometimes multiple)
      - "(e)"
      - "e"
      - "(s)"
      - "s"

> Conjugate.conjugate(tense, subject, verb)

Calls conjugator `__Tense(s, v)` on subject and verb based on tense input and returns the answers, plus some other data for building the practice page

##### "tense"

- Tense to use conjugate with
  - See `Conjugator.constructor([options].tense)` for full list

##### "subject"

- Name of the subject / subject group
  - See `Conjugator.constructor([options].subject)` for full list

##### {verb}

- Keyed object containing:
  - {verb}**.name**
    - name of the verb (Ex. "Avoir")
  - {verb}**.verb**
    - object with information about the verb from `verbs.json`[name]

> Conjugate.random(input)

#### input

##### [input] | #input#

- If an array: return a random value therein
- If a number `n`: return a random number from 0 thru `n - 1`

> Conjugate.versions(answer, subjects [,skip_agreement])

##### "answer"

- String (possibly modified by `Conjugate.agreement(subject)`)

##### "subjects"

##### skip_agreement (optional)

- Don't apply `Conjugate.agreement(subjects)` to the results

#### [output]

- Array of strings

> Conjugate.compress(str)

#### "input"

- String of a subject and conjugated verb

#### "output"

- String of the subject and verb, but with apostraphie for double vowels (w/ Je + vowel\_\_)
