"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/routes/task/update-task.ts
var update_task_exports = {};
__export(update_task_exports, {
  updateTask: () => updateTask
});
module.exports = __toCommonJS(update_task_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/models/task.ts
var import_zod = require("zod");
var TaskModel = import_zod.z.object({
  id: import_zod.z.string().uuid(),
  title: import_zod.z.string(),
  completed: import_zod.z.boolean()
});

// src/http/routes/task/update-task.ts
var import_zod2 = require("zod");
var import_console = __toESM(require("console"));
async function updateTask(app) {
  app.withTypeProvider().put(
    "/task/:id",
    {
      schema: {
        body: TaskModel,
        params: import_zod2.z.object({
          id: import_zod2.z.string()
        })
      }
    },
    async (request, reply) => {
      try {
        const { title, completed } = request.body;
        const { id } = request.params;
        const updatedTask = await prisma.task.update({
          where: {
            id
          },
          data: {
            title,
            completed
          }
        });
        reply.code(200).send(updatedTask);
      } catch (error) {
        import_console.default.error(error);
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
  updateTask
});
