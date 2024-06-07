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

// src/http/routes/task/create-task.ts
var create_task_exports = {};
__export(create_task_exports, {
  createTask: () => createTask
});
module.exports = __toCommonJS(create_task_exports);

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

// src/http/routes/task/create-task.ts
var CreateTaskModel = TaskModel.omit({ id: true });
async function createTask(app) {
  app.withTypeProvider().post(
    "/tasks",
    {
      schema: {
        body: CreateTaskModel
      }
    },
    async (request, reply) => {
      try {
        const { title, completed } = request.body;
        const { userId } = request.cookies;
        const task = await prisma.task.create({
          data: {
            title,
            completed,
            userId
          }
        });
        reply.code(201).send(task);
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
  createTask
});
