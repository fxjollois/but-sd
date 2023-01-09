library(pdftools)

fichier = "PN-BUT-STID.pdf"

text = pdf_text("PN-BUT-STID.pdf")

f = function(text) {
  # text = gsub("– ([a-zA-Z \']*)\n([a-zA-Z])", "– \\1_\n\n\\2_", text)
  text = iconv(text, to = "UTF-8")
  text = gsub("([:space:]*)– ([a-zéèàœA-ZÉ0-9 '’|,\\./:\\(\\)]*)\n([A-Z])", "\\1- \\2\n\n\\3", text)
  return (text)
}
text = sapply(text, f, USE.NAMES = FALSE)

# je vire les bas de pages
text_split = unlist(strsplit(text, "\n"))

bas1 = grep("©Ministère", text_split)
bas2 = grep("http://www.enseignementsup-recherche.gouv.fr", text_split)

text_split_sans_bas = text_split[-c(bas1, bas2)]

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

lignes = sort(c(lignes_Semestre, lignes_Chapitre, 
                lignes_SAE, lignes_RES, lignes_PF, 
                lignes_Stage, length(text_split_sans_bas)))



nettoyage_chaine = function(chaine) {
  trimws(gsub("-", "", gsub("–", "", chaine))) 
}




################################################################################
# SAE et RES

decode_ligne1 = function(ligne1) {
  s1 = strsplit(ligne1, ":")[[1]]
  nom = trimws(s1[2])
  s2 = strsplit(s1[1], " ")[[1]]
  type = s2[length(s2) - 1]
  code = s2[length(s2)]
  semestre = ifelse(type == "Ressource", 
                    as.integer(substr(code, 2, 2)), 
                    as.integer(substr(code, 1, 1)))
  list(
    type = type,
    nom = nom,
    code = code,
    semestre = semestre
  )
}
# decode_ligne1("1.2.1.    SAÉ 1.01 : Reporting à partir de données stockées dans un SGBD relationnel")
# decode_ligne1("1.3.1.   Ressource R1.01 : Tableur et reporting")

decode_AC = function(lignes) {
  sapply(strsplit(lignes[grep("AC[0-9]+\\.[0-9]+", lignes)], "\\|"), function(l) {
    nettoyage_chaine(l[1])
  })
}
# decode_AC(text_split_sans_bas[1214:1251])

decode_R = function(lignes) {
  sapply(strsplit(lignes[grep("R[0-9]+\\.[0-9]+", lignes)], "\\|"), function(l) {
    nettoyage_chaine(l[1])
  })
}
# decode_R(text_split_sans_bas[1214:1251])

decode_competences_SAE = function(lignes) {
  debut = grep("Compétences* ciblées*", lignes)[1]
  limite = grep("Objectifs et problématique professionnelle", lignes)
  return(nettoyage_chaine(lignes[(debut+1):(limite-2)]))
}
# decode_competences_SAE(text_split_sans_bas[1214:1251])

decode_objectifs = function(lignes) {
  debut = grep("Objectifs et problématique professionnelle", lignes)
  fin = grep("Descriptif générique", lignes)
  paste(lignes[debut:(fin-1)], collapse = "\n")
}
# decode_objectifs(text_split_sans_bas[1214:1251])

decode_descriptif_SAE = function(lignes) {
  debut = grep("Descriptif générique", lignes)
  fin = grep("Apprentissages critiques", lignes)
  paste(lignes[debut:(fin-1)], collapse = "\n")
}
# decode_descriptif_SAE(text_split_sans_bas[1214:1251])

SAE_to_liste = function(lignes) {
  res = decode_ligne1(lignes[1])
  # res$lignes = lignes
  res$competences = decode_competences_SAE(lignes)
  res$objectifs = decode_objectifs(lignes)
  res$descriptif = decode_descriptif_SAE(lignes)
  res$AC = decode_AC(lignes)
  res$RES = decode_R(lignes)
  return(res)
}
# SAE_to_liste(text_split_sans_bas[1214:1251])
# SAE_to_liste(text_split_sans_bas[1252:1292])
# SAE_to_liste(text_split_sans_bas[2925:2974])

decode_competences_RES = function(lignes) {
  debut = grep("Compétences* ciblées*", lignes)[1]
  limite = grep("^SA", lignes)[1]
  return(nettoyage_chaine(lignes[(debut+1):(limite-2)]))
}
# decode_competences_RES(text_split_sans_bas[1479:1513])

decode_descriptif_RES = function(lignes) {
  debut = grep("Descriptif", lignes)
  fin = grep("Apprentissages* critiques*", lignes)
  paste(lignes[debut:(fin-1)], collapse = "\n")
}
# decode_descriptif_RES(text_split_sans_bas[1214:1251])

decode_SAE = function(lignes) {
  sapply(strsplit(lignes[grep("SA. [0-9]+\\.[0-9]+", lignes)], "\\|"), function(l) {
    nettoyage_chaine(l[1])
  })
}
# decode_SAE(text_split_sans_bas[1479:1513])

decode_motscles = function(lignes) {
  debut = grep("Mots clés", lignes)[1]
  fin = grep("Volume horaire", lignes)[1]
  res = unlist(strsplit(lignes[(debut+1):(fin-1)], "-"))
  nettoyage_chaine(res)
}
# decode_motscles(text_split_sans_bas[1479:1513])


RES_to_liste = function(lignes) {
  res = decode_ligne1(lignes[1])
  #res$lignes = lignes
  res$competences = decode_competences_RES(lignes)
  res$descriptif = decode_descriptif_RES(lignes)
  res$motscles = decode_motscles(lignes)
  res$AC = decode_AC(lignes)
  res$SAE = decode_SAE(lignes)
  return(res)
}
# RES_to_liste(text_split_sans_bas[1479:1513])
# RES_to_liste(text_split_sans_bas[2332:2369])

SAE = list()
RES = list()
for (i in 1:length(lignes)) {
  if (lignes[i] %in% lignes_SAE) {
    cat("\n\n", rep("*", 50), "\nSAE : ", lignes[i], "\n\n", sep = "")
    print(lignes[i+1])
    SAE[[length(SAE) + 1]] = SAE_to_liste(text_split_sans_bas[lignes[i]:(lignes[i+1]-1)]) 
  }
  if (lignes[i] %in% lignes_RES) {
    cat("\n\n", rep("*", 50), "\nRES : ", lignes[i], "\n\n", sep = "")
    print(lignes[i+1])
    RES[[length(RES) + 1]] = RES_to_liste(text_split_sans_bas[lignes[i]:(lignes[i+1]-1)]) 
  }
}

# text_split_sans_bas[1479:1513]

library(jsonlite)

################################################################################
# Compétences
but = fromJSON("but-sd--competences.json", simplifyVector = FALSE)
but$SAE = SAE
but$RES = RES

write_json(but, path = "but-sd-bis.json", auto_unbox = TRUE, pretty = TRUE)

