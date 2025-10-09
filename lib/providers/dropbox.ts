export async function fetchDropboxFiles(accessToken: string, path: string) {
  const res = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path }),
  })

  if (!res.ok) throw new Error("Failed to fetch from Dropbox")
  const data = await res.json()

  return data.entries.map((entry: any) => ({
    id: entry.id,
    name: entry.name,
    type: entry[".tag"],
    size: entry.size || 0,
    path: entry.path_lower,
    mimeType: entry.mime_type,
  }))
}
