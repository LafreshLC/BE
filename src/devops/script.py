import requests

GITLAB_API_URL = "https://gitlab.com/api/v4"
PERSONAL_ACCESS_TOKEN = "glpat-yYYuU25ZzyZpuyh-1AKc"

PROJECT_ID = "55800779"


def fetch_open_merge_requests():
    headers = {"PRIVATE-TOKEN": PERSONAL_ACCESS_TOKEN}
    params = {"state": "opened"}
    response = requests.get(
        f"{GITLAB_API_URL}/projects/{PROJECT_ID}/merge_requests",
        headers=headers,
        params=params,
    )
    merge_requests = response.json()
    return merge_requests


def create_merge_request_note(merge_requests):
    for mr in merge_requests:
        merge_request_iid = mr["iid"]
        url = f"{GITLAB_API_URL}/projects/{PROJECT_ID}/merge_requests/{merge_request_iid}/notes"
        headers = {"PRIVATE-TOKEN": PERSONAL_ACCESS_TOKEN}
        note_text = f'@{mr["assignee"]["username"]} Please review and merge this open merge request.'
        payload = {"body": note_text}
        response = requests.post(url, headers=headers, data=payload)
        if response.status_code == 201:
            print("Note created successfully.")
        else:
            print(
                f"Failed to create note. Status code: {response.status_code}, Error message: {response.text}"
            )


def main():
    merge_requests = fetch_open_merge_requests()
    if merge_requests:
        create_merge_request_note(merge_requests)
    else:
        print("No open merge requests found.")


if __name__ == "__main__":
    main()
