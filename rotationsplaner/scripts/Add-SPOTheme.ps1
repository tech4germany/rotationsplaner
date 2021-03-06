$themepalette = @{
“themePrimary” = “#416d8e”;
“themeLighterAlt” = “#f5f8fb”;
“themeLighter” = “#d9e4ed”;
“themeLight” = “#b9cedd”;
“themeTertiary” = “#7fa1bc”;
“themeSecondary” = “#527c9c”;
“themeDarkAlt” = “#3b6281";
“themeDark” = “#32536d”;
“themeDarker” = “#253d50";
“neutralLighterAlt” = “#f8f8f8";
“neutralLighter” = “#f4f4f4";
“neutralLight” = “#eaeaea”;
“neutralQuaternaryAlt” = “#dadada”;
“neutralQuaternary” = “#d0d0d0";
“neutralTertiaryAlt” = “#c8c8c8";
“neutralTertiary” = “#b9cedd”;
“neutralSecondary” = “#7fa1bc”;
“neutralPrimaryAlt” = “#527c9c”;
“neutralPrimary” = “#416d8e”;
“neutralDark” = “#32536d”;
“black” = “#253d50";
“white” = “#ffffff”;
}
Add-SPOTheme -Identity "Brando Brand" -Palette HashToDictionary($themepalette) -IsInverted $false