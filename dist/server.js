"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/server.ts
var import_fastify = __toESM(require("fastify"));
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");
var import_cors = __toESM(require("@fastify/cors"));
var import_cookie = require("@fastify/cookie");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/http/routes/task/get-tasks.ts
async function getTasks(app2) {
  app2.withTypeProvider().get(
    "/tasks",
    {
      schema: {}
    },
    async (request, reply) => {
      try {
        const { userId } = request.cookies;
        const tasks = await prisma.task.findMany({
          where: {
            userId
          }
        });
        reply.code(200).send(tasks);
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

// src/models/task.ts
var import_zod = require("zod");
var TaskModel = import_zod.z.object({
  id: import_zod.z.string().uuid(),
  title: import_zod.z.string(),
  completed: import_zod.z.boolean()
});

// src/http/routes/task/create-task.ts
var CreateTaskModel = TaskModel.omit({ id: true });
async function createTask(app2) {
  app2.withTypeProvider().post(
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

// src/http/routes/task/update-task.ts
var import_zod2 = require("zod");
var import_console = __toESM(require("console"));
async function updateTask(app2) {
  app2.withTypeProvider().put(
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

// src/http/routes/task/delete-task.ts
var import_zod3 = require("zod");
async function deleteTask(app2) {
  app2.withTypeProvider().delete(
    "/task/:id",
    {
      schema: {
        params: import_zod3.z.object({
          id: import_zod3.z.string()
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

// src/server.ts
var import_fastify_bcrypt = require("fastify-bcrypt");

// src/models/user.ts
var import_zod4 = require("zod");
var UserModel = import_zod4.z.object({
  id: import_zod4.z.string().uuid(),
  email: import_zod4.z.string().email(),
  name: import_zod4.z.string(),
  password: import_zod4.z.string()
});

// src/http/routes/user/create-user.ts
var CreateUserModel = UserModel.omit({ id: true });
async function createUser(app2) {
  app2.withTypeProvider().post(
    "/users",
    {
      schema: {
        body: CreateUserModel
      }
    },
    async (request, reply) => {
      try {
        const { email, name, password } = request.body;
        const passwordHash = await app2.bcrypt.hash(password);
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

// src/models/login.ts
var import_zod5 = require("zod");
var LoginModel = import_zod5.z.object({
  email: import_zod5.z.string().email(),
  password: import_zod5.z.string()
});

// src/http/routes/user/login.ts
var customResponse = (reply, statusCode, message) => {
  reply.code(statusCode).send({ message, error: true });
};
async function login(app2) {
  app2.withTypeProvider().post(
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
        const isPasswordCorrect = await app2.bcrypt.compare(
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

// src/middlewares/auth-cookie.ts
async function verifyAuthCookie(request, reply) {
  if (request.method === "POST" && (request.routeOptions.url === "/login" || request.routeOptions.url === "/users")) {
    return;
  }
  const { userId } = request.cookies;
  if (!userId) {
    reply.code(401).send({ code: "cookie-not-found" });
  }
}

// src/server.ts
var import_dotenv = __toESM(require("dotenv"));
var app = (0, import_fastify.default)().withTypeProvider();
app.setValidatorCompiler(import_fastify_type_provider_zod.validatorCompiler);
app.setSerializerCompiler(import_fastify_type_provider_zod.serializerCompiler);
app.register(import_fastify_bcrypt.fastifyBcrypt, {
  saltWorkFactor: 12
});
app.register(import_cors.default, {
  origin: process.env.FRONTEND_URL,
  credentials: true
});
app.register(import_cookie.fastifyCookie, {
  secret: "secret",
  parseOptions: {}
});
import_dotenv.default.config();
app.addHook("preHandler", verifyAuthCookie);
var PORT = process.env.PORT;
var HOST = process.env.HOST;
app.listen({ port: PORT, host: HOST }, (err) => {
  console.log(`Http server running on host: ${HOST} port ${PORT} \u{1F680}`);
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
app.register(getTasks);
app.register(createTask);
app.register(updateTask);
app.register(deleteTask);
app.register(createUser);
app.register(login);
