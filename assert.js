import { check } from 'k6';

export function assert(res, setswitherror) {
  for (const [checkname, setanderror] of Object.entries(setswitherror)) {
    let set = {}; set[checkname] = setanderror[0];
    if (!check(res, set)) {
        console.error(checkname + ": " + setanderror[1](res));
    }
  }
}