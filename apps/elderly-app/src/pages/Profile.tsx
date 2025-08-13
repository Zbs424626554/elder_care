import React, { useMemo, useState } from "react";
import { Typography } from "antd";
import { List, Divider, Button } from "antd-mobile";
import { AuthService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "/imgs/elderly.png";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const displayName = useMemo(
    () => currentUser?.realname || currentUser?.username || "未登录用户",
    [currentUser]
  );
  const maskPhone = (value?: string): string => {
    if (!value) return "-";
    const digitsOnly = value.replace(/\D/g, "");
    const normalized =
      digitsOnly.length >= 11 ? digitsOnly.slice(-11) : digitsOnly;
    if (normalized.length < 7) return value;
    const prefix = normalized.slice(0, 3);
    const suffix = normalized.slice(-4);
    return `${prefix}****${suffix}`;
  };
  const phone = maskPhone(currentUser?.phone);

  const [avatarSrc, setAvatarSrc] = useState<string>(
    currentUser?.avatar && currentUser.avatar.trim() !== ""
      ? currentUser.avatar
      : DEFAULT_AVATAR
  );

  return (
    <div style={{ padding: 12 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <img
            src={avatarSrc}
            onError={() => setAvatarSrc(DEFAULT_AVATAR)}
            alt="avatar"
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
              background: "#f5f5f5",
            }}
          />
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {displayName}
            </Typography.Title>
            <Typography.Paragraph style={{ margin: 0, color: "#888" }}>
              手机号：{phone}
            </Typography.Paragraph>
          </div>
        </div>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <List header="个人中心">
        <List.Item>基础资料</List.Item>
        <List.Item onClick={() => navigate("/home/health")}>健康档案</List.Item>
        <List.Item>账户与安全</List.Item>
      </List>

      <Divider style={{ margin: "12px 0" }} />

      <Button
        color="danger"
        fill="solid"
        block
        onClick={() => {
          AuthService.logout();
        }}
      >
        退出登录
      </Button>
    </div>
  );
};

export default Profile;
