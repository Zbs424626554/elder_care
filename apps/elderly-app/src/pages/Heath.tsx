import React, { useEffect, useMemo, useState } from "react";
import { Typography, Spin, Empty } from "antd";
import { List, Dialog, Button, Input, Space, Toast } from "antd-mobile";
import {
  ElderHealthService,
  type ElderHealthArchiveDto,
} from "../services/elderhealth.service";

const { Title } = Typography;

const Heath: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [archive, setArchive] = useState<ElderHealthArchiveDto | null>(null);
  // 预留转换工具（当前未使用）
  const safe = (v?: string | number): string =>
    v === undefined || v === null || String(v).trim() === ""
      ? "未设置"
      : String(v);

  const content = useMemo(() => {
    return (
      <List>
        <List.Item extra={safe(archive?.name)}>姓名</List.Item>
        <List.Item extra={safe(archive?.age as unknown as string)}>
          年龄
        </List.Item>
        <List.Item extra={safe(archive?.phone)}>电话</List.Item>
        <List.Item extra={safe(archive?.address)}>地址</List.Item>
        <List.Item
          extra={safe(
            archive?.emcontact?.realname || archive?.emcontact?.username
          )}
          arrow={false}
          onClick={() => {
            let username = archive?.emcontact?.username || "";
            let realname = archive?.emcontact?.realname || "";
            let phone = archive?.emcontact?.phone || "";
            const isValidPhone = (p: string) =>
              /^1[3-9]\d{9}$/.test(p.replace(/\D/g, ""));

            let handler: any;
            handler = Dialog.show({
              title: "紧急联系人",
              content: (
                <div style={{ paddingTop: 12 }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Input
                      placeholder="用户名"
                      defaultValue={username}
                      onChange={(v) => (username = v)}
                    />
                    <Input
                      placeholder="真实姓名"
                      defaultValue={realname}
                      onChange={(v) => (realname = v)}
                    />
                    <Input
                      type="tel"
                      placeholder="手机号"
                      defaultValue={phone}
                      onChange={(v) => (phone = v)}
                    />
                  </Space>
                </div>
              ),
              closeOnMaskClick: false,
              actions: [
                {
                  key: "cancel",
                  text: "取消",
                  onClick: () => {
                    Toast.show({ content: "已取消" });
                    handler.close();
                  },
                },
                {
                  key: "ok",
                  text: "保存",
                  bold: true,
                  onClick: () => {
                    const cleanPhone = phone.replace(/\D/g, "");
                    if (phone && !isValidPhone(phone)) {
                      Toast.show({ content: "手机号格式不正确" });
                      return;
                    }
                    // 调用后端保存
                    ElderHealthService.saveEmergencyContact({
                      username: username?.trim(),
                      realname: realname?.trim(),
                      phone: cleanPhone,
                    })
                      .then((archiveData) => {
                        setArchive(archiveData || null);
                        Toast.show({ content: "已保存" });
                        handler.close();
                      })
                      .catch((err) => {
                        Toast.show({
                          content: (err?.message as string) || "保存失败",
                        });
                      });
                  },
                },
              ],
            });
          }}
        >
          紧急联系人
        </List.Item>
        <List.Item
          arrow
          onClick={() => {
            const items = archive?.medicals || [];
            const openAdd = () => {
              let inputValue = "";
              let handler: any;
              handler = Dialog.show({
                title: "添加疾病史",
                content: (
                  <div style={{ paddingTop: 12 }}>
                    <Input
                      placeholder="请输入疾病名称"
                      onChange={(v) => (inputValue = v)}
                    />
                  </div>
                ),
                closeOnMaskClick: false,
                actions: [
                  {
                    key: "cancel",
                    text: "取消",
                    onClick: () => {
                      inputValue = "";
                      Toast.show({ content: "已取消" });
                      handler.close();
                    },
                  },
                  {
                    key: "ok",
                    text: "保存",
                    bold: true,
                    onClick: () => {
                      if (!inputValue || !inputValue.trim()) {
                        Toast.show({ content: "请输入内容" });
                        return;
                      }
                      setArchive((prev) => ({
                        ...(prev || ({} as any)),
                        medicals: [
                          ...((prev?.medicals as string[]) || []),
                          inputValue.trim(),
                        ],
                      }));
                      handler.close();
                    },
                  },
                ],
              });
            };
            Dialog.show({
              title: (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>疾病史</span>
                  <Button size="mini" color="primary" onClick={openAdd}>
                    添加
                  </Button>
                </div>
              ),
              content: (
                <div>
                  {items.length === 0 ? (
                    <div style={{ padding: 12 }}>
                      <Empty description="暂无疾病史" />
                    </div>
                  ) : (
                    items.map((m, idx) => (
                      <div key={idx} style={{ padding: "6px 0" }}>
                        {m}
                      </div>
                    ))
                  )}
                </div>
              ),
              closeOnMaskClick: true,
            });
          }}
        >
          疾病史
        </List.Item>
        <List.Item
          arrow
          onClick={() => {
            const items = archive?.allergies || [];
            const openAdd = () => {
              let inputValue = "";
              let handler: any;
              handler = Dialog.show({
                title: "添加过敏史",
                content: (
                  <div style={{ paddingTop: 12 }}>
                    <Input
                      placeholder="请输入过敏源"
                      onChange={(v) => (inputValue = v)}
                    />
                  </div>
                ),
                closeOnMaskClick: false,
                actions: [
                  {
                    key: "cancel",
                    text: "取消",
                    onClick: () => {
                      inputValue = "";
                      Toast.show({ content: "已取消" });
                      handler.close();
                    },
                  },
                  {
                    key: "ok",
                    text: "保存",
                    bold: true,
                    onClick: () => {
                      if (!inputValue || !inputValue.trim()) {
                        Toast.show({ content: "请输入内容" });
                        return;
                      }
                      setArchive((prev) => ({
                        ...(prev || ({} as any)),
                        allergies: [
                          ...((prev?.allergies as string[]) || []),
                          inputValue.trim(),
                        ],
                      }));
                      handler.close();
                    },
                  },
                ],
              });
            };
            Dialog.show({
              title: (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>过敏史</span>
                  <Button size="mini" color="primary" onClick={openAdd}>
                    添加
                  </Button>
                </div>
              ),
              content: (
                <div>
                  {items.length === 0 ? (
                    <div style={{ padding: 12 }}>
                      <Empty description="暂无过敏史" />
                    </div>
                  ) : (
                    items.map((a, idx) => (
                      <div key={idx} style={{ padding: "6px 0" }}>
                        {a}
                      </div>
                    ))
                  )}
                </div>
              ),
              closeOnMaskClick: true,
            });
          }}
        >
          过敏史
        </List.Item>
        <List.Item
          arrow
          onClick={() => {
            const meds = archive?.useMedication || [];
            const openAdd = () => {
              let name = "";
              let time = "";
              let handler: any;
              handler = Dialog.show({
                title: "添加用药",
                content: (
                  <div style={{ paddingTop: 12 }}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Input
                        placeholder="药品名称"
                        onChange={(v) => (name = v)}
                      />
                      <input
                        type="time"
                        style={{
                          width: "100%",
                          height: 36,
                          boxSizing: "border-box",
                        }}
                        onChange={(e) => (time = e.target.value)}
                      />
                    </Space>
                  </div>
                ),
                closeOnMaskClick: false,
                actions: [
                  {
                    key: "cancel",
                    text: "取消",
                    onClick: () => {
                      name = "";
                      time = "";
                      Toast.show({ content: "已取消" });
                      handler.close();
                    },
                  },
                  {
                    key: "ok",
                    text: "保存",
                    bold: true,
                    onClick: () => {
                      if (!name.trim() || !time.trim()) {
                        Toast.show({ content: "请填写完整" });
                        return;
                      }
                      setArchive((prev) => ({
                        ...(prev || ({} as any)),
                        useMedication: [
                          ...((prev?.useMedication as {
                            name: string;
                            time: string;
                          }[]) || []),
                          { name: name.trim(), time: time.trim() },
                        ],
                      }));
                      handler.close();
                    },
                  },
                ],
              });
            };
            Dialog.show({
              title: (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>用药时间设置</span>
                  <Button size="mini" color="primary" onClick={openAdd}>
                    添加
                  </Button>
                </div>
              ),
              content: (
                <div>
                  {meds.length === 0 ? (
                    <div style={{ padding: 12 }}>
                      <Empty description="暂无用药设置" />
                    </div>
                  ) : (
                    meds.map((u, idx) => (
                      <div key={idx} style={{ padding: "6px 0" }}>
                        {u.name} {u.time}
                      </div>
                    ))
                  )}
                </div>
              ),
              closeOnMaskClick: true,
            });
          }}
        >
          用药时间设置
        </List.Item>
      </List>
    );
  }, [archive]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data = await ElderHealthService.getMyArchive();
        if (!data) {
          // 若不存在则初始化档案
          const created = await ElderHealthService.initArchive();
          data = created;
          Toast.show({
            content: "未找到健康档案，已自动为您创建",
            icon: "success",
          });
        }
        setArchive(data || null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: 12 }}>
      <Title level={3}>健康档案</Title>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <Spin />
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 8, padding: 8 }}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Heath;
