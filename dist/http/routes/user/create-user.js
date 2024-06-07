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

// src/http/routes/user/create-user.ts
var create_user_exports = {};
__export(create_user_exports, {
  createUser: () => createUser
});
module.exports = __toCommonJS(create_user_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/models/user.ts
var import_zod = require("zod");
var UserModel = import_zod.z.object({
  id: import_zod.z.string().uuid(),
  email: import_zod.z.string().email(),
  name: import_zod.z.string(),
  password: import_zod.z.string()
});

// src/http/routes/user/create-user.ts
var CreateUserModel = UserModel.omit({ id: true });
async function createUser(app) {
  app.withTypeProvider().post(
    "/users",
    {
      schema: {
        body: CreateUserModel
      }
    },
    async (request, reply) => {
      try {
        const { email, name, password } = request.body;
        const passwordHash = await app.bcrypt.hash(password);
        const emailExists = await prisma.user.findUnique({
          where: {
            email
          }
        });
        if (emailExists) {
          reply.code(400).send({ message: "J\xE1 existe uma conta com esse email." });
        }
        await prisma.user.create({
          data: {
            email,
            name,
            password: passwordHash
          }
        });
        reply.code(201).send();
      } catch (error) {
        console.error(error);
        reply.code(500).send({
          message: "An error occurred.",
          error: error == null ? void 0 : error.toString()
        });
      }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUser
});
