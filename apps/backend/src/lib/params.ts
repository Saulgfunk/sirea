import type { Request } from 'express';

// Express 5's ParamsDictionary types values as `string | string[]` (to support
// repeated route params), which combined with noUncheckedIndexedAccess makes
// every `req.params.x` read `string | string[] | undefined`. None of this
// app's routes use repeated params, so this asserts the common case instead
// of casting at every call site.
export function param(req: Request, name: string): string {
  const value = req.params[name];
  if (typeof value !== 'string') {
    throw new Error(`Missing required route param: ${name}`);
  }
  return value;
}
