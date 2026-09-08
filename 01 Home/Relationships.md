# Relationships

The full work CRM surface. One note per person in [[05 Work OS/Relationships/|Relationships]], grouped by the `relationship` property.

## The groups

- `internal` · colleagues at Dwell Communities
- `vendor` · contractors, suppliers, service providers
- `broker` · brokers and agents
- `owner` · owners, investors, partners
- `resident` · only when Graham asks for a note, tenancy and communication facts only
- `other` · everyone else

## Who needs attention

Contacts with a non-blank `attention` flag. Set and cleared only on Graham's word, never because time passed. When the flag turns into a concrete action, that action belongs in [[05 Work OS/Tasks/Tasks|Tasks]].

## Adding someone

An agent creates a contact only when Graham names the operation: add this person, update them, set or clear attention. A name appearing in an email thread or a calendar invite is not permission.

For someone he only wants to be able to find again, one line in [[02 Notes/Names to remember|Names to remember]] is the lighter and more reversible choice.

## What does not go in a contact note

No dossiers. No inferred sentiment. No judgment about a colleague's competence, motives, or character. No resident financial, medical, or identity detail, ever. He works with these people, and a note in a git repository outlives the mood that produced it.

The 50-conversations campaign lives in gOS, along with `conversation_date` and `conversation_scheduled`. Those properties do not exist here.

<!--
Bases views are not set up yet. Grouping by `relationship` needs either a Base
or Dataview, so for now this page explains the shape and the folder holds the
notes. Building the view is a weekly-review change.
-->
