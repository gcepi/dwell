# Task dashboard

Queries only. The ledger is [[05 Work OS/Tasks/Tasks|Tasks]].

## Due today or overdue

```tasks
path includes 05 Work OS/Tasks/Tasks.md
not done
due before tomorrow
sort by priority
sort by due
short mode
hide task count
```

## High priority

```tasks
path includes 05 Work OS/Tasks/Tasks.md
not done
priority is above none
sort by due
short mode
hide task count
```

## In progress

```tasks
path includes 05 Work OS/Tasks/Tasks.md
status.type is IN_PROGRESS
sort by due
short mode
hide task count
```

## Next 7 days

```tasks
path includes 05 Work OS/Tasks/Tasks.md
not done
due after today
due before in 8 days
sort by due
short mode
hide task count
```

## Waiting on someone

```tasks
path includes 05 Work OS/Tasks/Tasks.md
not done
heading includes Waiting
sort by due
short mode
hide task count
```

## No date, which should be none outside Someday

```tasks
path includes 05 Work OS/Tasks/Tasks.md
not done
no due date
heading does not include Someday
short mode
hide task count
```

## Someday

```tasks
path includes 05 Work OS/Tasks/Tasks.md
not done
heading includes Someday
short mode
hide task count
```

## Done in the last 7 days

```tasks
path includes 05 Work OS/Tasks/Tasks.md
done
done after 7 days ago
sort by done reverse
short mode
hide task count
```
