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

// src/http/routes/task/delete-task.ts
var delete_task_exports = {};
__export(delete_task_exports, {
  deleteTask: () => deleteTask
});
module.exports = __toCommonJS(delete_task_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/http/routes/task/delete-task.ts
var import_zod = require("zod");
async function deleteTask(app) {
  app.withTypeProvider().delete(
    "/task/:id",
    {
      schema: {
        params: import_zod.z.object({
          id: import_zod.z.string()
        })
      }
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        await prisma.task.delete({
          where: {
            id
          }
        });
        reply.code(200).send();
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
  deleteTask
});
