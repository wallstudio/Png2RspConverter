dotnet publish ^
    --output .\output ^
    --runtime win-x64 ^
    --self-contained=true ^
    -p:Configuration=Release ^
    /p:PublishSingleFile=true ^
    /p:IncludeNativeLibrariesForSelfExtract=true ^
    /p:DebugType=None ^
    /p:DebugSymbols=false ^