default_message="update"

# 手动输入
# echo -n "commit message: "
# read commit_message
# commit_message=${commit_message:-$default_message}

# 使用默认输入
commit_message=$default_message

PRE_COMMIT_ALLOW_NO_CONFIG=1 git add .
PRE_COMMIT_ALLOW_NO_CONFIG=1 git commit -m "$commit_message"
PRE_COMMIT_ALLOW_NO_CONFIG=1 git push
