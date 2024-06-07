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

// src/http/routes/user/login.ts
var login_exports = {};
__export(login_exports, {
  login: () => login
});
module.exports = __toCommonJS(login_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/models/login.ts
var import_zod = require("zod");
var LoginModel = import_zod.z.object({
  email: import_zod.z.string().email(),
  password: import_zod.z.string()
});

// src/http/routes/user/login.ts
var customResponse = (reply, statusCode, message) => {
  reply.code(statusCode).send({ message, error: true });
};
async function login(app) {
  app.withTypeProvider().post(
    "/login",
    {
      schema: {
        body: LoginModel
      }
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        const user = await prisma.user.findFirst({
          where: {
            email
          }
        });
        if (!user) {
          customResponse(
            reply,
            401,
            "N\xE3o existe conta para o e-mail informado."
          );
          return;
        }
        const isPasswordCorrect = await app.bcrypt.compare(
          password,
          user.password
        );
        if (!isPasswordCorrect) {
          customResponse(reply, 401, "E-mail ou senha inv\xE1lida.");
          return;
        }
        reply.setCookie("userId", user.id, {
          path: "/",
          signed: false,
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          expires: new Date(Date.now() + 1e3 * 60 * 60)
          // 1 hora
        }).send({ name: user.name });
      } catch (error) {
        console.error(error);
        customResponse(reply, 500, "An error occurred.");
      }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  login
});
