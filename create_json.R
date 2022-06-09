library(pdftools)

text = pdf_text("PN-BUT-STID.pdf")

# je vire les bas de pages
text_split = unlist(strsplit(text, "\n"))

bas1 = grep("©Ministère", text_split)
bas2 = grep("http://www.enseignementsup-recherche.gouv.fr", text_split)

text_split_sans_bas = text_split[-c(bas1, bas2)]

# Boucle pour récupérer SAE, Portofolio et ressources à part

recherche_pages = function(pat, text) {
  res = grep(pattern = pat, x = text)
  return(res[which(res > grep("Deuxième partie", text))])
}

lignes_Semestre = recherche_pages("Semestre [1-6]", text_split_sans_bas)
lignes_Chapitre = recherche_pages("Chapitre [0-9]", text_split_sans_bas)
lignes_SAE = recherche_pages("[0-9\\.]{3}.*SAÉ [1-6]", text_split_sans_bas)
lignes_RES = recherche_pages("[0-9\\.]{3}.*Ressource R[1-6]", text_split_sans_bas)
lignes_PF = recherche_pages("[0-9\\.]{3}.*PORTFOLIO", text_split_sans_bas)
lignes_Stage = recherche_pages("[0-9\\.]{3}.*STAGE", text_split_sans_bas)

lignes = sort(c(lignes_Semestre, lignes_Chapitre, lignes_SAE, lignes_RES, lignes_PF, lignes_Stage, length(text_split_sans_bas)))
# text_split_sans_bas[lignes]

remplace_tiret = function(texte) {
  return (sub("– ", "- ", texte))
}

ajout_h3 = function(texte, pattern) {
  if (length(grep(pattern, texte))) {
    texte = paste0("\n### ", texte, "\n")
  }
  return (texte)
}

traitement = function(texte) {
  for (i in 1:length(texte)) {
    texte[i] = trimws(remplace_tiret(texte[i]))
    texte[i] = ajout_h3(texte[i], "Compétence[s]* ciblée[s]*")
    texte[i] = ajout_h3(texte[i], "Objectifs et problématique")
    texte[i] = ajout_h3(texte[i], "Apprentissage[s]* critique[s]*")
    texte[i] = ajout_h3(texte[i], "Ressource[s]* mobilisée[s]*")
    texte[i] = ajout_h3(texte[i], "Volume horaire :")
    texte[i] = ajout_h3(texte[i], "SAÉ au sein de")
    texte[i] = ajout_h3(texte[i], "Descriptif")
    texte[i] = ajout_h3(texte[i], "Contenus")
    texte[i] = ajout_h3(texte[i], "Mots clés")
  }
  return(paste(texte, collapse = "\n"))
}
# cat(traitement(text_split_sans_bas[(lignes[2]+1):(lignes[3]-1)]))

traitement_SAE = function(texte) {
  res = list(type = "SAE")
  split = strsplit(texte[1], ": ")[[1]]
  res$numero = trimws(strsplit(split[1], "SAÉ")[[1]][2])
  num_split = strsplit(res$numero, "\\.")[[1]]
  res$semestre = num_split[1]
  res$numero_seul = num_split[length(num_split)]
  res$libelle = trimws(split[2])
  res$texte = traitement(texte[2:length(texte)])
  res$numero_long = paste0("SAE ", res$numero)
  return(res)
}
# traitement_SAE(but[[1]])

traitement_RES = function(texte) {
  res = list(type = "RES")
  split = strsplit(texte[1], ": ")[[1]]
  res$numero = trimws(strsplit(split[1], "Ressource")[[1]][2])
  num_split = strsplit(res$numero, "\\.")[[1]]
  res$semestre = sub("R", "", num_split[1])
  res$numero_seul = num_split[length(num_split)]
  res$libelle = trimws(split[2])
  res$texte = traitement(texte[2:length(texte)])
  res$numero_long = paste0("RES ", res$numero)
  return(res)
}
# traitement_RES(but[[8]])

traitement_PF = function(texte){
  res = list(type = "PF")
  split = strsplit(texte[1], ": ")[[1]]
  res$libelle = trimws(split[2])
  res$texte = traitement(texte[2:length(texte)])
  return(res)
}

traitement_Stage = function(texte){
  res = list(type = "STAGE")
  split = strsplit(texte[1], ": ")[[1]]
  res$libelle = trimws(split[2])
  res$texte = traitement(texte[2:length(texte)])
  return(res)
}

but = list()
parcours = c("EMS", "VCOD")
changement_parcours = FALSE
for (i in 1:(length(lignes)-1)) {
  l = lignes[i]
  if (l %in% lignes_Chapitre) { next; }
  if (l %in% lignes_Semestre) {
    semestre = strsplit(text_split_sans_bas[l], "[ ]+")[[1]][3]
    if (length(grep("Semestre 3", text_split_sans_bas[l]))) {
      if (!changement_parcours) {
        parcours = "VCOD"
        changement_parcours = TRUE
      } else {
        parcours = "EMS"
      }
    } 
  } else {
    t = text_split_sans_bas[lignes[i]:(lignes[i+1]-1)]
    if (l %in% lignes_SAE) 
      t = traitement_SAE(t)
    if (l %in% lignes_RES)
      t = traitement_RES(t)
    if (l %in% lignes_PF) {
      t = traitement_PF(t)
      t$semestre = semestre
      t$numero_long = paste0("PF", semestre)
    }
    if (l %in% lignes_Stage) {
      t = traitement_Stage(t)
      t$semestre = semestre
      t$numero_long = paste0("Stage ", semestre)
      #print(semestre, t$libelle)
    }
    t$parcours = parcours
    but[[length(but) + 1]] = t
  }
}

library(jsonlite)

write_json(but, path = "but-sd.json", auto_unbox = TRUE, pretty = TRUE)
