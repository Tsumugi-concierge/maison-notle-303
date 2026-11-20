import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const expected = {
  property: "1127324686",
  commonRules: "2144241359",
  faq: "44823007",
  propertyFaq: "1790829854",
};
const configSource = source.slice(source.indexOf("const CONFIG ="), source.indexOf("};", source.indexOf("const CONFIG =")) + 2);
const config = vm.runInNewContext(configSource + "; CONFIG");

test("Maison Notle 303の物件情報・部屋別FAQだけを参照する", () => {
  assert.equal(config.sheetId, "1Ex05ckGULQi-T8kmHbW6ksIHd48wQu6UCGaaN1x9hRA");
  assert.deepEqual(JSON.parse(JSON.stringify(config.gids)), expected);
  assert.notEqual(config.gids.property, "1655416281");
  assert.notEqual(config.gids.propertyFaq, "1569422357");
});

test("チャットの要求にも正しい部屋の参照先を渡す（外部通信なし）", async () => {
  const start = source.indexOf("async function sendMessage(");
  const end = source.indexOf("function addMsg(", start);
  assert.ok(start > 0 && end > start);
  const calls = [];
  const element = () => ({ value: "", appendChild() {}, style: {}, scrollTop: 0, scrollHeight: 0, remove() {} });
  const nodes = new Map();
  const context = {
    CONFIG: config, history: [], currentLang: "ja", addMsg() {},
    document: {
      getElementById: id => { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); },
      createElement: element,
    },
    fetch: async (url, options) => {
      calls.push({ url, options });
      return { ok: true, json: async () => ({ content: [{ text: "合成テスト応答" }] }) };
    },
  };
  vm.createContext(context);
  vm.runInContext(source.slice(start, end) + "; this.sendTest = sendMessage;", context);
  await context.sendTest("合成テスト。物件名を確認します。");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, config.workerUrl);
  const body = JSON.parse(calls[0].options.body);
  assert.deepEqual(body.gids, expected);
  assert.equal(body.sheetId, config.sheetId);
  assert.equal(body.lang, "ja");
});

