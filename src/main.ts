import { registerBookItemUseHandler } from "./book/item-use-handler";

registerBookItemUseHandler();

if (__DEV__) {
  const dirty = __BUILD_INFO__.dirty ? " dirty" : "";
  console.warn(
    `[Player's Spell Book] development v${__BUILD_INFO__.version} ` +
      `${__BUILD_INFO__.branch}@${__BUILD_INFO__.commit}${dirty} built ${__BUILD_INFO__.builtAt}`,
  );
}
