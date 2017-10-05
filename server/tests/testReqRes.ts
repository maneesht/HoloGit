export const test1req = `
	query {
		branches (username: "maneesht" repo: "todo-app"){
			id
		}
	}
`;;
export const test1res = {
	"data": {
		"branches": [
			{
				"id": "cleanup"
			},
			{
				"id": "master"
			}
		]
	}
};

export const test2req = "";
export const test2res = "";
