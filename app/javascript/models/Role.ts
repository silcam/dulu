interface StrObj {
  [key: string]: string;
}

const roleDomains: StrObj = {
  Administration: "",
  BackTranslator: "Translation",
  DuluAdmin: "",
  Cluster_coordinator: "All",
  Cluster_facilitator: "All",
  Exegete: "Translation",
  Facilitator: "",
  LanguageProgramCommittee: "All",
  LanguageProgramFacilitator: "All",
  Leader: "",
  Linguist: "Linguistics",
  LinguisticConsultant: "Linguistics",
  LinguisticConsultantTraining: "Linguistics",
  Literacy_specialist: "Literacy",
  Literacy_consultant: "Literacy",
  MediaConsultant: "Media",
  MediaSpecialist: "Media",
  ProjectCoordinator: "All",
  Scripture_engagement_specialist: "Scripture_use",
  Student: "",
  Translator: "Translation",
  TranslationConsultant: "Translation",
  TranslationConsultantTraining: "Translation"
};

export function domainFromRole(role: string) {
  let domain = roleDomains[role];
  if (domain === undefined) console.error("No domain listed for role: " + role);
  return domain;
}
