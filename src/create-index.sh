> index.ts # Czyści plik przed rozpoczęciem
for f in *.ts; do
    if [[ "$f" == "index.ts" ]]; then
        continue
    fi
    name="${f%.ts}"
    echo "export * from './$name';" >> index.ts
done
