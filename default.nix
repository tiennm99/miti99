{ pkgs ? import <nixpkgs> {} }:
pkgs.stdenv.mkDerivation {
  name = "hugo-build";
  buildInputs = [ pkgs.hugo_extended ];
  buildPhase = ''
    mkdir -p /app/public
    hugo --minify --destination /app/public
  '';
  installPhase = ''
    cp -r /app/public/* $out
  '';
}