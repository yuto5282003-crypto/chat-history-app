import { demoSystemSettings, demoAccountSettings, demoContentRules } from "@/lib/demo-data";
import { SettingsPanel } from "@/components/settings/settings-panel";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">運用ルールとシステム設定を管理します</p>
      <SettingsPanel
        system={demoSystemSettings}
        account={demoAccountSettings}
        rules={demoContentRules}
      />
    </div>
  );
}
