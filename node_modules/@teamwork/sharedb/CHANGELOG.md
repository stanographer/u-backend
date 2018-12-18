# v3.0.1

## Non-breaking changes

- Ignore undoable no-ops in UndoManager. As a result, no-ops will no longer clear the redo stack.


# v3.0.0

## Breaking changes

- The error code for "OT Type does not support presence" changed from 4024 to 4029. The change was necessary to remain compatible with the official ShareDB repo.

## Non-breaking changes

- Snapshot Milestones were merged from the official ShareDB repo.


# v2.0.1

## Breaking changes

## Non-breaking changes

- Fix tests for sharedb-mongo.


# v2.0.0

## Breaking changes

- Remove support for the `clientIdPrefix` parameter passed into `Agent`. Use middleware actions to store extra data with operations, see https://github.com/share/sharedb/pull/224#issuecomment-406207724.
- Overhaul the undo/redo API.
- Log warnings when using deprecated features.

## Non-breaking changes


# v1.4.0

## Breaking changes

## Non-breaking changes

- Support `skipNoop` option for `Doc.submitOp` and `Doc.submitSnapshot`. By default no-ops are NOT skipped. This actually restores backward compatibility which was broken by v1.2.0 which started skipping no-ops by default.


# v1.3.0

## Breaking changes

## Non-breaking changes

- Support a custom `clientId` prefix, see `ShareDB.listen`.


# v1.2.0

## Breaking changes

## Non-breaking changes

- Add local undo/redo support for document operations.
- Implement `Doc.submitSnapshot`.


# v1.1.0

## Breaking changes

## Non-breaking changes

- Add presence data synchronization.


# v1.0-beta

## Breaking changes

- Add options argument to all public database adapter methods that read or write from snapshots or ops.
- DB methods that get snapshots or ops no longer return metadata unless `{metadata: true}` option is passed.
- Replace `source` argument with `options` in doc methods. Use `options.source` instead.
- Backend streams now write objects intead of strings.
- MemoryDB.prototype._querySync now returns `{snapshots: ..., extra: ...}` instead of just an array of snapshots.

## Non-breaking changes

- Add options argument to backend.submit.
- Add error codes to all errors.
- Add `'updated'` event on queries which fires on all query result changes.
- In clients, wrap errors in Error objects to they get passed through event emitters.
- Sanitize stack traces when sending errors to client, but log them on the server.


# v0.11.37

Beginning of changelog.

If you're upgrading from ShareJS 0.7 or earlier,
take a look at the [ShareJS upgrade guide](docs/upgrading-from-sharejs.md).
