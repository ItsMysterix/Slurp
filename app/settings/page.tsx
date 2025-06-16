"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { isAuthenticated, getUserProfile, updateUserSettings, exportUserData } from "@/lib/supabase"
import { useLanguage } from "@/lib/language-context"

export default function SettingsPage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [theme, setTheme] = useState("light")
  const [fontSize, setFontSize] = useState("medium")
  const [privateMode, setPrivateMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const authenticated = await isAuthenticated()
        if (!authenticated) {
          router.push("/auth")
          return
        }

        const profile = await getUserProfile()
        if (profile?.settings) {
          setTheme(profile.settings.theme || "light")
          setFontSize(profile.settings.fontSize || "medium")
          setPrivateMode(profile.settings.privateMode || false)
          setNotificationsEnabled(profile.settings.notificationsEnabled !== false)
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [router])

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      const settings = {
        theme,
        fontSize,
        privateMode,
        notificationsEnabled,
      }

      await updateUserSettings(settings)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      setIsExporting(true)
      const data = await exportUserData()

      // Create a blob and download it
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "slurp-data-export.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    } catch (error) {
      console.error("Error exporting data:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent mx-auto"></div>
          <p className="text-black font-bold text-lg">🍹 {t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-black">⚙️ {t("settings.title")}</h1>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-4 bg-transparent">
          <TabsTrigger
            value="appearance"
            className="border-[2px] border-black bg-pink-100 data-[state=active]:bg-pink-300 text-black font-bold shadow-[4px_4px_0px_#000] data-[state=active]:shadow-[2px_2px_0px_#000] data-[state=active]:translate-y-[2px] data-[state=active]:translate-x-[2px]"
          >
            {t("settings.appearance")}
          </TabsTrigger>
          <TabsTrigger
            value="language"
            className="border-[2px] border-black bg-yellow-100 data-[state=active]:bg-yellow-300 text-black font-bold shadow-[4px_4px_0px_#000] data-[state=active]:shadow-[2px_2px_0px_#000] data-[state=active]:translate-y-[2px] data-[state=active]:translate-x-[2px]"
          >
            {t("settings.language")}
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className="border-[2px] border-black bg-green-100 data-[state=active]:bg-green-300 text-black font-bold shadow-[4px_4px_0px_#000] data-[state=active]:shadow-[2px_2px_0px_#000] data-[state=active]:translate-y-[2px] data-[state=active]:translate-x-[2px]"
          >
            {t("settings.export")}
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="border-[2px] border-black bg-blue-100 data-[state=active]:bg-blue-300 text-black font-bold shadow-[4px_4px_0px_#000] data-[state=active]:shadow-[2px_2px_0px_#000] data-[state=active]:translate-y-[2px] data-[state=active]:translate-x-[2px]"
          >
            {t("settings.privacy")}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="appearance">
            <Card className="border-[2px] border-black shadow-[6px_6px_0px_#000]">
              <CardHeader className="border-b-2 border-black bg-pink-200">
                <CardTitle className="text-black">🎨 {t("settings.appearance")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-black">Theme</h3>
                    <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-2 gap-4">
                      <div>
                        <RadioGroupItem value="light" id="light" className="peer sr-only" />
                        <Label
                          htmlFor="light"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-black bg-white p-4 hover:bg-gray-100 hover:text-gray-900 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-pink-100"
                        >
                          <div className="mb-2 h-12 w-12 rounded-full bg-yellow-300 border-2 border-black flex items-center justify-center">
                            <span className="text-2xl">☀️</span>
                          </div>
                          <span className="font-bold text-black">Light Mode</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                        <Label
                          htmlFor="dark"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-black bg-white p-4 hover:bg-gray-100 hover:text-gray-900 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-pink-100"
                        >
                          <div className="mb-2 h-12 w-12 rounded-full bg-indigo-900 border-2 border-black flex items-center justify-center">
                            <span className="text-2xl">🌙</span>
                          </div>
                          <span className="font-bold text-black">Dark Mode</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-medium text-black">{t("settings.fontSize")}</h3>
                    <RadioGroup value={fontSize} onValueChange={setFontSize} className="grid grid-cols-3 gap-4">
                      <div>
                        <RadioGroupItem value="small" id="small" className="peer sr-only" />
                        <Label
                          htmlFor="small"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-black bg-white p-4 hover:bg-gray-100 hover:text-gray-900 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-pink-100"
                        >
                          <span className="text-sm font-bold text-black">Aa</span>
                          <span className="mt-2 text-xs text-black">Small</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
                        <Label
                          htmlFor="medium"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-black bg-white p-4 hover:bg-gray-100 hover:text-gray-900 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-pink-100"
                        >
                          <span className="text-base font-bold text-black">Aa</span>
                          <span className="mt-2 text-xs text-black">Medium</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="large" id="large" className="peer sr-only" />
                        <Label
                          htmlFor="large"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-black bg-white p-4 hover:bg-gray-100 hover:text-gray-900 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-pink-100"
                        >
                          <span className="text-lg font-bold text-black">Aa</span>
                          <span className="mt-2 text-xs text-black">Large</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card className="border-[2px] border-black shadow-[6px_6px_0px_#000]">
              <CardHeader className="border-b-2 border-black bg-yellow-200">
                <CardTitle className="text-black">🌐 {t("settings.languageSettings")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-black">{t("settings.selectLanguage")}</h3>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-full border-2 border-black">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-black">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="hi">हिन्दी</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-lg border-2 border-black bg-yellow-50 p-4">
                    <h3 className="mb-2 text-lg font-medium text-black">{t("settings.languagePreview")}</h3>
                    <p className="text-black">{t("dashboard.welcome")}, Slurpy! 🍹</p>
                    <p className="text-black">{t("dashboard.howFeeling")}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-black border border-black">
                        {t("emotion.happy")}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-black border border-black">
                        {t("emotion.calm")}
                      </span>
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-black border border-black">
                        {t("emotion.stressed")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export">
            <Card className="border-[2px] border-black shadow-[6px_6px_0px_#000]">
              <CardHeader className="border-b-2 border-black bg-green-200">
                <CardTitle className="text-black">📊 {t("settings.exportMoodHistory")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="rounded-lg border-2 border-black bg-green-50 p-4">
                    <h3 className="mb-2 text-lg font-medium text-black">Export Your Data</h3>
                    <p className="mb-4 text-black">
                      Download all your mood entries, journal entries, and profile information as a JSON file.
                    </p>
                    <Button
                      onClick={handleExportData}
                      disabled={isExporting}
                      className="border-2 border-black bg-green-300 font-bold text-black shadow-[4px_4px_0px_#000] hover:bg-green-400"
                    >
                      {isExporting ? "Exporting..." : "Export My Data"}
                    </Button>
                    {exportSuccess && (
                      <p className="mt-2 text-green-600">✅ Export successful! Check your downloads folder.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card className="border-[2px] border-black shadow-[6px_6px_0px_#000]">
              <CardHeader className="border-b-2 border-black bg-blue-200">
                <CardTitle className="text-black">🔒 {t("settings.privacySecurity")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-black">Private Mode</h3>
                      <p className="text-sm text-gray-600">Hide your mood entries from other users</p>
                    </div>
                    <Switch
                      checked={privateMode}
                      onCheckedChange={setPrivateMode}
                      className="border-2 border-black data-[state=checked]:bg-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-black">Notifications</h3>
                      <p className="text-sm text-gray-600">Receive reminders to log your mood</p>
                    </div>
                    <Switch
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                      className="border-2 border-black data-[state=checked]:bg-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="border-2 border-black bg-yellow-300 px-8 py-2 font-bold text-black shadow-[4px_4px_0px_#000] hover:bg-yellow-400"
          >
            {isSaving ? "Saving..." : t("common.save")}
          </Button>
          {saveSuccess && (
            <span className="ml-4 text-green-600 flex items-center">✅ Settings saved successfully!</span>
          )}
        </div>
      </Tabs>
    </div>
  )
}
