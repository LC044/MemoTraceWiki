@echo off
set "source_folder=E:\Project\web\MemoTraceWiki\src\posts"
set "destination_folder=E:\Project\Python\Langchain-Chatchat\knowledge_base\MemoTrace\content"

echo Copying .md files from %source_folder% to %destination_folder%...

rem 创建目标文件夹
mkdir %destination_folder% 2>nul

rem 复制文件
for /r "%source_folder%" %%f in (*.md) do (
    copy "%%f" "%destination_folder%" >nul
    echo "%%f"
)

echo Copy completed.
