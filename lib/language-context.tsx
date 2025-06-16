"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Comprehensive translation dictionary
const translations = {
  en: {
    // Navigation & Layout
    "nav.dashboard": "Dashboard",
    "nav.add": "Add Mood",
    "nav.insights": "Insights",
    "nav.calendar": "Calendar",
    "nav.journal": "Journal",
    "nav.settings": "Settings",
    "nav.profile": "Profile",
    "nav.help": "Help & Resources",
    "nav.signOut": "Sign Out",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.howFeeling": "How are you feeling today?",
    "dashboard.addMood": "Add Mood",
    "dashboard.weeklyGoal": "Weekly Mood Goal",
    "dashboard.todaysMission": "Today's Mission",
    "dashboard.recentLogs": "Recent Logs",
    "dashboard.moodInsights": "Mood Insights",
    "dashboard.writeWithSlurpy": "Write with Slurpy",
    "dashboard.7dayStreak": "7-Day Streak",
    "dashboard.energyLevel": "Energy Level",
    "dashboard.totalEntries": "Total Entries:",
    "dashboard.thisWeek": "This Week:",
    "dashboard.mostUsed": "Most Used:",
    "dashboard.viewDetails": "View Details",
    "dashboard.openJournal": "Open Journal",
    "dashboard.markAsDone": "Mark as Done",
    "dashboard.completed": "Completed!",
    "dashboard.mostRecentLog": "Most recent log:",
    "dashboard.never": "Never",

    // Mood Selection
    "mood.selectMood": "Select your mood",
    "mood.howFeelingToday": "How are you feeling today?",
    "mood.addNote": "Add a note (optional)",
    "mood.logMood": "Log Mood",
    "mood.moodLogged": "Mood logged successfully!",

    // Common UI
    "common.save": "Save Changes",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.loading": "Loading...",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.submit": "Submit",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.today": "Today",
    "common.yesterday": "Yesterday",
    "common.thisWeek": "This Week",
    "common.thisMonth": "This Month",
    "common.thisYear": "This Year",

    // Settings
    "settings.title": "Settings",
    "settings.appearance": "Appearance",
    "settings.language": "Language",
    "settings.export": "Export",
    "settings.privacy": "Privacy",
    "settings.fontSize": "Font Size",
    "settings.languageSettings": "Language Settings",
    "settings.selectLanguage": "Select Language",
    "settings.languagePreview": "Language Preview",
    "settings.exportMoodHistory": "Export Mood History",
    "settings.privacySecurity": "Privacy & Security",

    // Insights
    "insights.title": "Mood Insights",
    "insights.howEvolved": "Here's how your fruit-powered feelings have evolved",
    "insights.mostFrequent": "Most Frequent",
    "insights.mostRecent": "Most Recent",
    "insights.longestStreak": "Longest Streak",
    "insights.moodFrequency": "Mood Frequency",
    "insights.moodDistribution": "Mood Distribution",
    "insights.weeklyTrends": "Weekly Trends",
    "insights.noData": "No previous data found!",
    "insights.talkToSlurpy": "Talk to Slurpy",

    // Calendar
    "calendar.title": "Fruity Calendar",
    "calendar.filterByMood": "Filter by Mood:",
    "calendar.addMood": "Add Mood",
    "calendar.noMoodsToday": "No fruity moods today",
    "calendar.addFirstMood": "Add your first mood for this day!",
    "calendar.logYourMood": "Log Your Fruity Mood",
    "calendar.chooseMoodFruit": "Choose your mood fruit:",
    "calendar.notes": "Notes (optional)",
    "calendar.whatsOnMind": "What's on your mind? Any details about your mood...",

    // Journal
    "journal.title": "My Journal",
    "journal.newEntry": "New Entry",
    "journal.entryTitle": "Entry Title (Optional)",
    "journal.journalContent": "Journal Content",
    "journal.writeThoughts": "Write about your day, feelings, thoughts, or anything that comes to mind...",
    "journal.selectFeelings": "How are you feeling? (Select all that apply)",
    "journal.analyzeAndSave": "Analyze & Save Entry",
    "journal.analyzingWithAI": "Analyzing with AI...",
    "journal.noEntriesYet": "No journal entries yet",
    "journal.startJourney": "Start your AI-powered journaling journey today!",
    "journal.writeFirstEntry": "Write Your First Entry",

    // Help & Resources
    "help.title": "Resources & Help",
    "help.supportTools": "Support tools and resources for when you need a little extra help",
    "help.emergency": "Emergency",
    "help.coping": "Coping",
    "help.professional": "Professional",
    "help.emergencySupport": "Emergency Support",
    "help.quickCopingTools": "Quick Coping Tools",
    "help.professionalHelp": "Professional Help Resources",

    // Profile
    "profile.title": "Your Profile",
    "profile.manageIdentity": "Manage your fruity identity",
    "profile.userIdentity": "USER IDENTITY",
    "profile.username": "Username",
    "profile.fullName": "Full Name",
    "profile.fruitPersona": "Fruit Persona",
    "profile.anonymousMode": "Anonymous Mode",
    "profile.hideIdentity": "Hide your identity in leaderboards",
    "profile.saveProfile": "Save Profile",
    "profile.privacyData": "PRIVACY & DATA",
    "profile.exportMoodLogs": "Export Mood Logs",
    "profile.deleteAllData": "Delete All Data",

    // Emotions
    "emotion.happy": "Happy",
    "emotion.sad": "Sad",
    "emotion.excited": "Excited",
    "emotion.anxious": "Anxious",
    "emotion.grateful": "Grateful",
    "emotion.frustrated": "Frustrated",
    "emotion.calm": "Calm",
    "emotion.energetic": "Energetic",
    "emotion.tired": "Tired",
    "emotion.content": "Content",
    "emotion.stressed": "Stressed",
    "emotion.joyful": "Joyful",
  },
  es: {
    // Navigation & Layout
    "nav.dashboard": "Panel",
    "nav.add": "Agregar Estado",
    "nav.insights": "Perspectivas",
    "nav.calendar": "Calendario",
    "nav.journal": "Diario",
    "nav.settings": "Configuración",
    "nav.profile": "Perfil",
    "nav.help": "Ayuda y Recursos",
    "nav.signOut": "Cerrar Sesión",

    // Dashboard
    "dashboard.welcome": "Bienvenido de vuelta",
    "dashboard.howFeeling": "¿Cómo te sientes hoy?",
    "dashboard.addMood": "Agregar Estado",
    "dashboard.weeklyGoal": "Meta Semanal de Estado",
    "dashboard.todaysMission": "Misión de Hoy",
    "dashboard.recentLogs": "Registros Recientes",
    "dashboard.moodInsights": "Perspectivas del Estado",
    "dashboard.writeWithSlurpy": "Escribir con Slurpy",
    "dashboard.7dayStreak": "Racha de 7 Días",
    "dashboard.energyLevel": "Nivel de Energía",
    "dashboard.totalEntries": "Entradas Totales:",
    "dashboard.thisWeek": "Esta Semana:",
    "dashboard.mostUsed": "Más Usado:",
    "dashboard.viewDetails": "Ver Detalles",
    "dashboard.openJournal": "Abrir Diario",
    "dashboard.markAsDone": "Marcar como Hecho",
    "dashboard.completed": "¡Completado!",
    "dashboard.mostRecentLog": "Registro más reciente:",
    "dashboard.never": "Nunca",

    // Mood Selection
    "mood.selectMood": "Selecciona tu estado",
    "mood.howFeelingToday": "¿Cómo te sientes hoy?",
    "mood.addNote": "Agregar una nota (opcional)",
    "mood.logMood": "Registrar Estado",
    "mood.moodLogged": "¡Estado registrado exitosamente!",

    // Common UI
    "common.save": "Guardar Cambios",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.loading": "Cargando...",
    "common.close": "Cerrar",
    "common.back": "Atrás",
    "common.next": "Siguiente",
    "common.previous": "Anterior",
    "common.submit": "Enviar",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.all": "Todo",
    "common.today": "Hoy",
    "common.yesterday": "Ayer",
    "common.thisWeek": "Esta Semana",
    "common.thisMonth": "Este Mes",
    "common.thisYear": "Este Año",

    // Settings
    "settings.title": "Configuración",
    "settings.appearance": "Apariencia",
    "settings.language": "Idioma",
    "settings.export": "Exportar",
    "settings.privacy": "Privacidad",
    "settings.fontSize": "Tamaño de Fuente",
    "settings.languageSettings": "Configuración de Idioma",
    "settings.selectLanguage": "Seleccionar Idioma",
    "settings.languagePreview": "Vista Previa del Idioma",
    "settings.exportMoodHistory": "Exportar Historial de Estados",
    "settings.privacySecurity": "Privacidad y Seguridad",

    // Insights
    "insights.title": "Perspectivas del Estado",
    "insights.howEvolved": "Así es como han evolucionado tus sentimientos frutales",
    "insights.mostFrequent": "Más Frecuente",
    "insights.mostRecent": "Más Reciente",
    "insights.longestStreak": "Racha Más Larga",
    "insights.moodFrequency": "Frecuencia del Estado",
    "insights.moodDistribution": "Distribución del Estado",
    "insights.weeklyTrends": "Tendencias Semanales",
    "insights.noData": "¡No se encontraron datos anteriores!",
    "insights.talkToSlurpy": "Hablar con Slurpy",

    // Calendar
    "calendar.title": "Calendario Frutal",
    "calendar.filterByMood": "Filtrar por Estado:",
    "calendar.addMood": "Agregar Estado",
    "calendar.noMoodsToday": "No hay estados frutales hoy",
    "calendar.addFirstMood": "¡Agrega tu primer estado para este día!",
    "calendar.logYourMood": "Registra Tu Estado Frutal",
    "calendar.chooseMoodFruit": "Elige tu fruta de estado:",
    "calendar.notes": "Notas (opcional)",
    "calendar.whatsOnMind": "¿Qué tienes en mente? Cualquier detalle sobre tu estado...",

    // Journal
    "journal.title": "Mi Diario",
    "journal.newEntry": "Nueva Entrada",
    "journal.entryTitle": "Título de Entrada (Opcional)",
    "journal.journalContent": "Contenido del Diario",
    "journal.writeThoughts":
      "Escribe sobre tu día, sentimientos, pensamientos, o cualquier cosa que venga a tu mente...",
    "journal.selectFeelings": "¿Cómo te sientes? (Selecciona todos los que apliquen)",
    "journal.analyzeAndSave": "Analizar y Guardar Entrada",
    "journal.analyzingWithAI": "Analizando con IA...",
    "journal.noEntriesYet": "Aún no hay entradas de diario",
    "journal.startJourney": "¡Comienza tu viaje de diario con IA hoy!",
    "journal.writeFirstEntry": "Escribe Tu Primera Entrada",

    // Help & Resources
    "help.title": "Recursos y Ayuda",
    "help.supportTools": "Herramientas de apoyo y recursos para cuando necesites ayuda adicional",
    "help.emergency": "Emergencia",
    "help.coping": "Afrontamiento",
    "help.professional": "Profesional",
    "help.emergencySupport": "Apoyo de Emergencia",
    "help.quickCopingTools": "Herramientas Rápidas de Afrontamiento",
    "help.professionalHelp": "Recursos de Ayuda Profesional",

    // Profile
    "profile.title": "Tu Perfil",
    "profile.manageIdentity": "Gestiona tu identidad frutal",
    "profile.userIdentity": "IDENTIDAD DE USUARIO",
    "profile.username": "Nombre de Usuario",
    "profile.fullName": "Nombre Completo",
    "profile.fruitPersona": "Persona Frutal",
    "profile.anonymousMode": "Modo Anónimo",
    "profile.hideIdentity": "Ocultar tu identidad en las clasificaciones",
    "profile.saveProfile": "Guardar Perfil",
    "profile.privacyData": "PRIVACIDAD Y DATOS",
    "profile.exportMoodLogs": "Exportar Registros de Estado",
    "profile.deleteAllData": "Eliminar Todos los Datos",

    // Emotions
    "emotion.happy": "Feliz",
    "emotion.sad": "Triste",
    "emotion.excited": "Emocionado",
    "emotion.anxious": "Ansioso",
    "emotion.grateful": "Agradecido",
    "emotion.frustrated": "Frustrado",
    "emotion.calm": "Tranquilo",
    "emotion.energetic": "Enérgico",
    "emotion.tired": "Cansado",
    "emotion.content": "Contento",
    "emotion.stressed": "Estresado",
    "emotion.joyful": "Alegre",
  },
  zh: {
    // Navigation & Layout
    "nav.dashboard": "仪表板",
    "nav.add": "添加心情",
    "nav.insights": "洞察",
    "nav.calendar": "日历",
    "nav.journal": "日记",
    "nav.settings": "设置",
    "nav.profile": "个人资料",
    "nav.help": "帮助与资源",
    "nav.signOut": "退出登录",

    // Dashboard
    "dashboard.welcome": "欢迎回来",
    "dashboard.howFeeling": "你今天感觉如何？",
    "dashboard.addMood": "添加心情",
    "dashboard.weeklyGoal": "每周心情目标",
    "dashboard.todaysMission": "今日任务",
    "dashboard.recentLogs": "最近记录",
    "dashboard.moodInsights": "心情洞察",
    "dashboard.writeWithSlurpy": "与Slurpy一起写作",
    "dashboard.7dayStreak": "7天连续",
    "dashboard.energyLevel": "能量水平",
    "dashboard.totalEntries": "总条目：",
    "dashboard.thisWeek": "本周：",
    "dashboard.mostUsed": "最常用：",
    "dashboard.viewDetails": "查看详情",
    "dashboard.openJournal": "打开日记",
    "dashboard.markAsDone": "标记为完成",
    "dashboard.completed": "已完成！",
    "dashboard.mostRecentLog": "最近记录：",
    "dashboard.never": "从未",

    // Mood Selection
    "mood.selectMood": "选择你的心情",
    "mood.howFeelingToday": "你今天感觉如何？",
    "mood.addNote": "添加备注（可选）",
    "mood.logMood": "记录心情",
    "mood.moodLogged": "心情记录成功！",

    // Common UI
    "common.save": "保存更改",
    "common.cancel": "取消",
    "common.delete": "删除",
    "common.edit": "编辑",
    "common.loading": "加载中...",
    "common.close": "关闭",
    "common.back": "返回",
    "common.next": "下一个",
    "common.previous": "上一个",
    "common.submit": "提交",
    "common.search": "搜索",
    "common.filter": "筛选",
    "common.all": "全部",
    "common.today": "今天",
    "common.yesterday": "昨天",
    "common.thisWeek": "本周",
    "common.thisMonth": "本月",
    "common.thisYear": "今年",

    // Settings
    "settings.title": "设置",
    "settings.appearance": "外观",
    "settings.language": "语言",
    "settings.export": "导出",
    "settings.privacy": "隐私",
    "settings.fontSize": "字体大小",
    "settings.languageSettings": "语言设置",
    "settings.selectLanguage": "选择语言",
    "settings.languagePreview": "语言预览",
    "settings.exportMoodHistory": "导出心情历史",
    "settings.privacySecurity": "隐私与安全",

    // Insights
    "insights.title": "心情洞察",
    "insights.howEvolved": "这是你的水果动力情感的演变过程",
    "insights.mostFrequent": "最频繁",
    "insights.mostRecent": "最近的",
    "insights.longestStreak": "最长连续",
    "insights.moodFrequency": "心情频率",
    "insights.moodDistribution": "心情分布",
    "insights.weeklyTrends": "每周趋势",
    "insights.noData": "未找到以前的数据！",
    "insights.talkToSlurpy": "与Slurpy交谈",

    // Calendar
    "calendar.title": "水果日历",
    "calendar.filterByMood": "按心情筛选：",
    "calendar.addMood": "添加心情",
    "calendar.noMoodsToday": "今天没有水果心情",
    "calendar.addFirstMood": "为这一天添加你的第一个心情！",
    "calendar.logYourMood": "记录你的水果心情",
    "calendar.chooseMoodFruit": "选择你的心情水果：",
    "calendar.notes": "备注（可选）",
    "calendar.whatsOnMind": "你在想什么？关于你心情的任何细节...",

    // Journal
    "journal.title": "我的日记",
    "journal.newEntry": "新条目",
    "journal.entryTitle": "条目标题（可选）",
    "journal.journalContent": "日记内容",
    "journal.writeThoughts": "写下你的一天、感受、想法，或任何想到的事情...",
    "journal.selectFeelings": "你感觉如何？（选择所有适用的）",
    "journal.analyzeAndSave": "分析并保存条目",
    "journal.analyzingWithAI": "正在用AI分析...",
    "journal.noEntriesYet": "还没有日记条目",
    "journal.startJourney": "今天开始你的AI驱动日记之旅！",
    "journal.writeFirstEntry": "写下你的第一个条目",

    // Help & Resources
    "help.title": "资源与帮助",
    "help.supportTools": "当你需要额外帮助时的支持工具和资源",
    "help.emergency": "紧急情况",
    "help.coping": "应对",
    "help.professional": "专业",
    "help.emergencySupport": "紧急支持",
    "help.quickCopingTools": "快速应对工具",
    "help.professionalHelp": "专业帮助资源",

    // Profile
    "profile.title": "你的个人资料",
    "profile.manageIdentity": "管理你的水果身份",
    "profile.userIdentity": "用户身份",
    "profile.username": "用户名",
    "profile.fullName": "全名",
    "profile.fruitPersona": "水果角色",
    "profile.anonymousMode": "匿名模式",
    "profile.hideIdentity": "在排行榜中隐藏你的身份",
    "profile.saveProfile": "保存个人资料",
    "profile.privacyData": "隐私与数据",
    "profile.exportMoodLogs": "导出心情日志",
    "profile.deleteAllData": "删除所有数据",

    // Emotions
    "emotion.happy": "快乐",
    "emotion.sad": "悲伤",
    "emotion.excited": "兴奋",
    "emotion.anxious": "焦虑",
    "emotion.grateful": "感激",
    "emotion.frustrated": "沮丧",
    "emotion.calm": "平静",
    "emotion.energetic": "精力充沛",
    "emotion.tired": "疲倦",
    "emotion.content": "满足",
    "emotion.stressed": "压力",
    "emotion.joyful": "欢乐",
  },
  fr: {
    // Navigation & Layout
    "nav.dashboard": "Tableau de bord",
    "nav.add": "Ajouter Humeur",
    "nav.insights": "Aperçus",
    "nav.calendar": "Calendrier",
    "nav.journal": "Journal",
    "nav.settings": "Paramètres",
    "nav.profile": "Profil",
    "nav.help": "Aide et Ressources",
    "nav.signOut": "Se Déconnecter",

    // Dashboard
    "dashboard.welcome": "Bon retour",
    "dashboard.howFeeling": "Comment vous sentez-vous aujourd'hui?",
    "dashboard.addMood": "Ajouter Humeur",
    "dashboard.weeklyGoal": "Objectif Hebdomadaire d'Humeur",
    "dashboard.todaysMission": "Mission d'Aujourd'hui",
    "dashboard.recentLogs": "Journaux Récents",
    "dashboard.moodInsights": "Aperçus d'Humeur",
    "dashboard.writeWithSlurpy": "Écrire avec Slurpy",
    "dashboard.7dayStreak": "Série de 7 Jours",
    "dashboard.energyLevel": "Niveau d'Énergie",
    "dashboard.totalEntries": "Entrées Totales:",
    "dashboard.thisWeek": "Cette Semaine:",
    "dashboard.mostUsed": "Le Plus Utilisé:",
    "dashboard.viewDetails": "Voir les Détails",
    "dashboard.openJournal": "Ouvrir le Journal",
    "dashboard.markAsDone": "Marquer comme Terminé",
    "dashboard.completed": "Terminé!",
    "dashboard.mostRecentLog": "Journal le plus récent:",
    "dashboard.never": "Jamais",

    // Mood Selection
    "mood.selectMood": "Sélectionnez votre humeur",
    "mood.howFeelingToday": "Comment vous sentez-vous aujourd'hui?",
    "mood.addNote": "Ajouter une note (optionnel)",
    "mood.logMood": "Enregistrer l'Humeur",
    "mood.moodLogged": "Humeur enregistrée avec succès!",

    // Common UI
    "common.save": "Sauvegarder les Modifications",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.loading": "Chargement...",
    "common.close": "Fermer",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.previous": "Précédent",
    "common.submit": "Soumettre",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.all": "Tout",
    "common.today": "Aujourd'hui",
    "common.yesterday": "Hier",
    "common.thisWeek": "Cette Semaine",
    "common.thisMonth": "Ce Mois",
    "common.thisYear": "Cette Année",

    // Settings
    "settings.title": "Paramètres",
    "settings.appearance": "Apparence",
    "settings.language": "Langue",
    "settings.export": "Exporter",
    "settings.privacy": "Confidentialité",
    "settings.fontSize": "Taille de Police",
    "settings.languageSettings": "Paramètres de Langue",
    "settings.selectLanguage": "Sélectionner la Langue",
    "settings.languagePreview": "Aperçu de la Langue",
    "settings.exportMoodHistory": "Exporter l'Historique des Humeurs",
    "settings.privacySecurity": "Confidentialité et Sécurité",

    // Insights
    "insights.title": "Aperçus d'Humeur",
    "insights.howEvolved": "Voici comment vos sentiments fruités ont évolué",
    "insights.mostFrequent": "Le Plus Fréquent",
    "insights.mostRecent": "Le Plus Récent",
    "insights.longestStreak": "Plus Longue Série",
    "insights.moodFrequency": "Fréquence d'Humeur",
    "insights.moodDistribution": "Distribution d'Humeur",
    "insights.weeklyTrends": "Tendances Hebdomadaires",
    "insights.noData": "Aucune donnée précédente trouvée!",
    "insights.talkToSlurpy": "Parler à Slurpy",

    // Calendar
    "calendar.title": "Calendrier Fruité",
    "calendar.filterByMood": "Filtrer par Humeur:",
    "calendar.addMood": "Ajouter Humeur",
    "calendar.noMoodsToday": "Pas d'humeurs fruitées aujourd'hui",
    "calendar.addFirstMood": "Ajoutez votre première humeur pour ce jour!",
    "calendar.logYourMood": "Enregistrez Votre Humeur Fruitée",
    "calendar.chooseMoodFruit": "Choisissez votre fruit d'humeur:",
    "calendar.notes": "Notes (optionnel)",
    "calendar.whatsOnMind": "Qu'avez-vous en tête? Des détails sur votre humeur...",

    // Journal
    "journal.title": "Mon Journal",
    "journal.newEntry": "Nouvelle Entrée",
    "journal.entryTitle": "Titre de l'Entrée (Optionnel)",
    "journal.journalContent": "Contenu du Journal",
    "journal.writeThoughts": "Écrivez sur votre journée, sentiments, pensées, ou tout ce qui vous vient à l'esprit...",
    "journal.selectFeelings": "Comment vous sentez-vous? (Sélectionnez tout ce qui s'applique)",
    "journal.analyzeAndSave": "Analyser et Sauvegarder l'Entrée",
    "journal.analyzingWithAI": "Analyse avec IA...",
    "journal.noEntriesYet": "Pas encore d'entrées de journal",
    "journal.startJourney": "Commencez votre voyage de journal alimenté par l'IA aujourd'hui!",
    "journal.writeFirstEntry": "Écrivez Votre Première Entrée",

    // Help & Resources
    "help.title": "Ressources et Aide",
    "help.supportTools": "Outils de soutien et ressources pour quand vous avez besoin d'aide supplémentaire",
    "help.emergency": "Urgence",
    "help.coping": "Adaptation",
    "help.professional": "Professionnel",
    "help.emergencySupport": "Soutien d'Urgence",
    "help.quickCopingTools": "Outils d'Adaptation Rapide",
    "help.professionalHelp": "Ressources d'Aide Professionnelle",

    // Profile
    "profile.title": "Votre Profil",
    "profile.manageIdentity": "Gérez votre identité fruitée",
    "profile.userIdentity": "IDENTITÉ UTILISATEUR",
    "profile.username": "Nom d'Utilisateur",
    "profile.fullName": "Nom Complet",
    "profile.fruitPersona": "Persona Fruité",
    "profile.anonymousMode": "Mode Anonyme",
    "profile.hideIdentity": "Masquer votre identité dans les classements",
    "profile.saveProfile": "Sauvegarder le Profil",
    "profile.privacyData": "CONFIDENTIALITÉ ET DONNÉES",
    "profile.exportMoodLogs": "Exporter les Journaux d'Humeur",
    "profile.deleteAllData": "Supprimer Toutes les Données",

    // Emotions
    "emotion.happy": "Heureux",
    "emotion.sad": "Triste",
    "emotion.excited": "Excité",
    "emotion.anxious": "Anxieux",
    "emotion.grateful": "Reconnaissant",
    "emotion.frustrated": "Frustré",
    "emotion.calm": "Calme",
    "emotion.energetic": "Énergique",
    "emotion.tired": "Fatigué",
    "emotion.content": "Content",
    "emotion.stressed": "Stressé",
    "emotion.joyful": "Joyeux",
  },
  hi: {
    // Navigation & Layout
    "nav.dashboard": "डैशबोर्ड",
    "nav.add": "मूड जोड़ें",
    "nav.insights": "अंतर्दृष्टि",
    "nav.calendar": "कैलेंडर",
    "nav.journal": "डायरी",
    "nav.settings": "सेटिंग्स",
    "nav.profile": "प्रोफ़ाइल",
    "nav.help": "सहायता और संसाधन",
    "nav.signOut": "साइन आउट",

    // Dashboard
    "dashboard.welcome": "वापसी पर स्वागत",
    "dashboard.howFeeling": "आज आप कैसा महसूस कर रहे हैं?",
    "dashboard.addMood": "मूड जोड़ें",
    "dashboard.weeklyGoal": "साप्ताहिक मूड लक्ष्य",
    "dashboard.todaysMission": "आज का मिशन",
    "dashboard.recentLogs": "हाल की लॉग्स",
    "dashboard.moodInsights": "मूड अंतर्दृष्टि",
    "dashboard.writeWithSlurpy": "Slurpy के साथ लिखें",
    "dashboard.7dayStreak": "7-दिन की लकीर",
    "dashboard.energyLevel": "ऊर्जा स्तर",
    "dashboard.totalEntries": "कुल प्रविष्टियां:",
    "dashboard.thisWeek": "इस सप्ताह:",
    "dashboard.mostUsed": "सबसे अधिक उपयोग:",
    "dashboard.viewDetails": "विवरण देखें",
    "dashboard.openJournal": "डायरी खोलें",
    "dashboard.markAsDone": "पूर्ण के रूप में चिह्नित करें",
    "dashboard.completed": "पूर्ण!",
    "dashboard.mostRecentLog": "सबसे हाल की लॉग:",
    "dashboard.never": "कभी नहीं",

    // Mood Selection
    "mood.selectMood": "अपना मूड चुनें",
    "mood.howFeelingToday": "आज आप कैसा महसूस कर रहे हैं?",
    "mood.addNote": "एक नोट जोड़ें (वैकल्पिक)",
    "mood.logMood": "मूड लॉग करें",
    "mood.moodLogged": "मूड सफलतापूर्वक लॉग किया गया!",

    // Common UI
    "common.save": "परिवर्तन सहेजें",
    "common.cancel": "रद्द करें",
    "common.delete": "हटाएं",
    "common.edit": "संपादित करें",
    "common.loading": "लोड हो रहा है...",
    "common.close": "बंद करें",
    "common.back": "वापस",
    "common.next": "अगला",
    "common.previous": "पिछला",
    "common.submit": "जमा करें",
    "common.search": "खोजें",
    "common.filter": "फ़िल्टर",
    "common.all": "सभी",
    "common.today": "आज",
    "common.yesterday": "कल",
    "common.thisWeek": "इस सप्ताह",
    "common.thisMonth": "इस महीने",
    "common.thisYear": "इस साल",

    // Settings
    "settings.title": "सेटिंग्स",
    "settings.appearance": "दिखावट",
    "settings.language": "भाषा",
    "settings.export": "निर्यात",
    "settings.privacy": "गोपनीयता",
    "settings.fontSize": "फ़ॉन्ट आकार",
    "settings.languageSettings": "भाषा सेटिंग्स",
    "settings.selectLanguage": "भाषा चुनें",
    "settings.languagePreview": "भाषा पूर्वावलोकन",
    "settings.exportMoodHistory": "मूड इतिहास निर्यात करें",
    "settings.privacySecurity": "गोपनीयता और सुरक्षा",

    // Insights
    "insights.title": "मूड अंतर्दृष्टि",
    "insights.howEvolved": "यहाँ है कि आपकी फल-संचालित भावनाएं कैसे विकसित हुई हैं",
    "insights.mostFrequent": "सबसे अधिक बार",
    "insights.mostRecent": "सबसे हाल का",
    "insights.longestStreak": "सबसे लंबी लकीर",
    "insights.moodFrequency": "मूड आवृत्ति",
    "insights.moodDistribution": "मूड वितरण",
    "insights.weeklyTrends": "साप्ताहिक रुझान",
    "insights.noData": "कोई पिछला डेटा नहीं मिला!",
    "insights.talkToSlurpy": "Slurpy से बात करें",

    // Calendar
    "calendar.title": "फलों का कैलेंडर",
    "calendar.filterByMood": "मूड के अनुसार फ़िल्टर करें:",
    "calendar.addMood": "मूड जोड़ें",
    "calendar.noMoodsToday": "आज कोई फलों का मूड नहीं",
    "calendar.addFirstMood": "इस दिन के लिए अपना पहला मूड जोड़ें!",
    "calendar.logYourMood": "अपना फलों का मूड लॉग करें",
    "calendar.chooseMoodFruit": "अपना मूड फल चुनें:",
    "calendar.notes": "नोट्स (वैकल्पिक)",
    "calendar.whatsOnMind": "आपके मन में क्या है? अपने मूड के बारे में कोई विवरण...",

    // Journal
    "journal.title": "मेरी डायरी",
    "journal.newEntry": "नई प्रविष्टि",
    "journal.entryTitle": "प्रविष्टि शीर्षक (वैकल्पिक)",
    "journal.journalContent": "डायरी सामग्री",
    "journal.writeThoughts": "अपने दिन, भावनाओं, विचारों, या मन में आने वाली किसी भी बात के बारे में लिखें...",
    "journal.selectFeelings": "आप कैसा महसूस कर रहे हैं? (सभी लागू होने वाले चुनें)",
    "journal.analyzeAndSave": "विश्लेषण करें और प्रविष्टि सहेजें",
    "journal.analyzingWithAI": "AI के साथ विश्लेषण कर रहे हैं...",
    "journal.noEntriesYet": "अभी तक कोई डायरी प्रविष्टि नहीं",
    "journal.startJourney": "आज ही अपनी AI-संचालित डायरी यात्रा शुरू करें!",
    "journal.writeFirstEntry": "अपनी पहली प्रविष्टि लिखें",

    // Help & Resources
    "help.title": "संसाधन और सहायता",
    "help.supportTools": "जब आपको अतिरिक्त सहायता की आवश्यकता हो तो सहायता उपकरण और संसाधन",
    "help.emergency": "आपातकाल",
    "help.coping": "सामना करना",
    "help.professional": "पेशेवर",
    "help.emergencySupport": "आपातकालीन सहायता",
    "help.quickCopingTools": "त्वरित सामना करने के उपकरण",
    "help.professionalHelp": "पेशेवर सहायता संसाधन",

    // Profile
    "profile.title": "आपकी प्रोफ़ाइल",
    "profile.manageIdentity": "अपनी फलों की पहचान प्रबंधित करें",
    "profile.userIdentity": "उपयोगकर्ता पहचान",
    "profile.username": "उपयोगकर्ता नाम",
    "profile.fullName": "पूरा नाम",
    "profile.fruitPersona": "फल व्यक्तित्व",
    "profile.anonymousMode": "गुमनाम मोड",
    "profile.hideIdentity": "लीडरबोर्ड में अपनी पहचान छुपाएं",
    "profile.saveProfile": "प्रोफ़ाइल सहेजें",
    "profile.privacyData": "गोपनीयता और डेटा",
    "profile.exportMoodLogs": "मूड लॉग्स निर्यात करें",
    "profile.deleteAllData": "सभी डेटा हटाएं",

    // Emotions
    "emotion.happy": "खुश",
    "emotion.sad": "उदास",
    "emotion.excited": "उत्साहित",
    "emotion.anxious": "चिंतित",
    "emotion.grateful": "आभारी",
    "emotion.frustrated": "निराश",
    "emotion.calm": "शांत",
    "emotion.energetic": "ऊर्जावान",
    "emotion.tired": "थका हुआ",
    "emotion.content": "संतुष्ट",
    "emotion.stressed": "तनावग्रस्त",
    "emotion.joyful": "आनंदित",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState("en")

  useEffect(() => {
    // Load saved language
    const savedLanguage = localStorage.getItem("slurp-language") || "en"
    setLanguageState(savedLanguage)
    document.documentElement.lang = savedLanguage
  }, [])

  useEffect(() => {
    // Listen for language change events
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguageState(event.detail.language)
      document.documentElement.lang = event.detail.language
    }

    window.addEventListener("languageChange", handleLanguageChange as EventListener)
    return () => window.removeEventListener("languageChange", handleLanguageChange as EventListener)
  }, [])

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    localStorage.setItem("slurp-language", lang)
    document.documentElement.lang = lang
  }

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations] || translations.en
    return langTranslations[key as keyof typeof langTranslations] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
