"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/middlewares/auth-cookie.ts
var auth_cookie_exports = {};
__export(auth_cookie_exports, {
  verifyAuthCookie: () => verifyAuthCookie
});
module.exports = __toCommonJS(auth_cookie_exports);
async function verifyAuthCookie(request, reply) {
  if (request.method === "POST" && (request.routeOptions.url === "/login" || request.routeOptions.url === "/users")) {
    return;
  }
  const { userId } = request.cookies;
  if (!userId) {
    reply.code(401).send({ code: "cookie-not-found" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  verifyAuthCookie
});
