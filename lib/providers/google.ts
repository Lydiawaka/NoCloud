export async function fetchGoogleDriveFiles(accessToken: string, path: string) {
  const folderId = path === "/" ? "root" : path

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and trashed=false&fields=files(id,name,mimeType,size,parents)`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) throw new Error("Failed to fetch from Google Drive")
  const data = await res.json()

  return data.files.map((file: any) => ({
    id: file.id,
    name: file.name,
    type: file.mimeType === "application/vnd.google-apps.folder" ? "folder" : "file",
    size: file.size ? Number(file.size) : 0,
    path: file.id,
    mimeType: file.mimeType,
  }))
}
