import { Router, Request, Response } from "express";
import { ElderHealthArchive } from "../../models/elderhealth.model";
import { User } from "../../models/user.model";
import { verifyToken } from "../../utils/jwt";

const router = Router();

// 获取当前登录老人的健康档案
router.get("/elderhealth/me", async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    let userId: string | null = null;

    if (auth && auth.startsWith("Bearer ")) {
      const token = auth.slice(7);
      try {
        const payload = verifyToken(token) as any;
        userId = payload?.id || null;
      } catch (err) {
        // ignore token errors to allow fallback to query
      }
    }

    // 允许通过查询参数传入 elderId 作为兜底
    const elderIdFromQuery = (req.query.elderId as string) || null;
    const elderId = userId || elderIdFromQuery;

    if (!elderId) {
      return res.json({ code: 401, message: "未登录", data: null });
    }

    const archive = await ElderHealthArchive.findOne({ elderID: elderId });
    return res.json({
      code: 200,
      message: archive ? "ok" : "未找到健康档案",
      data: archive,
    });
  } catch (error) {
    console.error("获取健康档案失败:", error);
    return res
      .status(500)
      .json({ code: 500, message: "服务器错误", data: null });
  }
});

// 根据 elderId 获取健康档案
router.get("/elderhealth/:elderId", async (req: Request, res: Response) => {
  try {
    const { elderId } = req.params;
    const archive = await ElderHealthArchive.findOne({ elderID: elderId });
    return res.json({
      code: 200,
      message: archive ? "ok" : "未找到健康档案",
      data: archive,
    });
  } catch (error) {
    console.error("获取健康档案失败:", error);
    return res
      .status(500)
      .json({ code: 500, message: "服务器错误", data: null });
  }
});

export default router;

// 新增/更新紧急联系人
router.post("/elderhealth/emcontact", async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    let userId: string | null = null;

    if (auth && auth.startsWith("Bearer ")) {
      const token = auth.slice(7);
      try {
        const payload = verifyToken(token) as any;
        userId = payload?.id || null;
      } catch (err) {
        // ignore
      }
    }

    const elderIdFromQuery = (req.query.elderId as string) || null;
    const elderId = userId || elderIdFromQuery;

    if (!elderId) {
      return res.json({ code: 401, message: "未登录", data: null });
    }

    const { username, realname, phone } = req.body || {};

    // 构建查询条件（根据提供的字段筛选）
    const query: any = {};
    if (username) query.username = username;
    if (realname) query.realname = realname;
    if (phone) query.phone = phone;

    if (Object.keys(query).length === 0) {
      return res.json({ code: 400, message: "缺少查询参数", data: null });
    }

    const contact = await User.findOne(query);
    if (!contact) {
      return res.json({ code: 404, message: "未找到该联系人", data: null });
    }

    // 仅更新，不创建
    const archive = await ElderHealthArchive.findOne({ elderID: elderId });
    if (!archive) {
      return res.json({ code: 404, message: "未找到健康档案", data: null });
    }

    archive.emcontact = {
      username: contact.username,
      phone: contact.phone,
      realname: contact.realname,
    } as any;
    await archive.save();

    return res.json({ code: 200, message: "保存成功", data: archive });
  } catch (error) {
    console.error("保存紧急联系人失败:", error);
    return res
      .status(500)
      .json({ code: 500, message: "服务器错误", data: null });
  }
});

// 初始化健康档案：如果不存在则根据 elderId 对应用户创建
router.post("/elderhealth/init", async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    let userId: string | null = null;

    if (auth && auth.startsWith("Bearer ")) {
      const token = auth.slice(7);
      try {
        const payload = verifyToken(token) as any;
        userId = payload?.id || null;
      } catch (err) {
        // ignore token errors
      }
    }

    const elderIdFromQuery = (req.query.elderId as string) || null;
    const elderId = userId || elderIdFromQuery;

    if (!elderId) {
      return res.json({ code: 401, message: "未登录", data: null });
    }

    let archive = await ElderHealthArchive.findOne({ elderID: elderId });
    if (!archive) {
      const elderUser = await User.findById(elderId).select("realname phone");
      // 使用 upsert 保证并发下只创建一次
      await ElderHealthArchive.updateOne(
        { elderID: elderId },
        {
          $setOnInsert: {
            elderID: elderId,
            name: elderUser?.realname || undefined,
            phone: elderUser?.phone,
          },
        },
        { upsert: true }
      );
      archive = await ElderHealthArchive.findOne({ elderID: elderId });
    }

    return res.json({ code: 200, message: "ok", data: archive });
  } catch (error) {
    console.error("初始化健康档案失败:", error);
    return res
      .status(500)
      .json({ code: 500, message: "服务器错误", data: null });
  }
});
