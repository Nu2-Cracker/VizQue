import jester, asyncdispatch

settings:
  staticDir = "static"

routes:
  get "/":
    resp "App"
runForever()
#nim server はバックエンド起動