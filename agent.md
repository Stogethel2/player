This is frontend project for lotto 

using seamless login must be have user token to using our website

i keep selected number (bet) in betStore.ts

# rule of code
1. follow the code style of the project
2. ensure the code is easy to read and understand
3. make sure the code is well-structured and organized
4. use meaningful variable and function names (if found nno meaningful name can change) 
5. make sure follow my command and do not add any other code 
6. ** double check and review the code before submitting

this is example data groupBetType
```
[
    {
        "groupName": "สามตัว",
        "digitGroup": 3,
        "betTypes": [
            {
                "id": "3b2ea507-1f0e-459f-9b42-ed32abf19d85",
                "bet_type": "THREE_DIGIT_TOP",
                "bet_type_name": "3 ตัวบน",
                "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                "bet_digit": 3,
                "min_bet": 1,
                "max_bet": 100000,
                "default_payout": 900,
                "current_payout_rate": 900,
                "is_active": true,
                "is_block": false,
                "version": 1,
                "close_bet_minutes": 30,
                "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                "lotto_name": "หุ้นไทยเย็น",
                "created_at": "2025-05-17T15:11:26.580Z",
                "deleted_at": null,
                "updated_at": "2025-05-17T15:11:27.155Z",
                "current_round_loss_id": "a05f8035-1c01-4e97-8bab-278e0c0c5ca4",
                "lottoLoss": [
                    {
                        "id": "a05f8035-1c01-4e97-8bab-278e0c0c5ca4",
                        "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                        "lotto_name": "หุ้นไทยเย็น",
                        "lotto_bet_type_id": "3b2ea507-1f0e-459f-9b42-ed32abf19d85",
                        "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "min_max_group": "1_100000_0_c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "max_loss": 100000,
                        "min_loss": 1,
                        "payout_rate": 900,
                        "version": 1,
                        "row_index": 0,
                        "created_at": "2025-05-17T15:11:26.950Z",
                        "deleted_at": null,
                        "updated_at": "2025-05-17T15:11:26.950Z"
                    }
                ]
            },
            {
                "id": "a3e3e912-0cf5-4413-84c6-037300d3088b",
                "bet_type": "THREE_DIGIT_BOTTOM",
                "bet_type_name": "3 ตัวล่าง",
                "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                "bet_digit": 3,
                "min_bet": 1,
                "max_bet": 100000,
                "default_payout": 450,
                "current_payout_rate": 450,
                "is_active": true,
                "is_block": false,
                "version": 1,
                "close_bet_minutes": 30,
                "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                "lotto_name": "หุ้นไทยเย็น",
                "created_at": "2025-05-17T15:11:26.580Z",
                "deleted_at": null,
                "updated_at": "2025-05-17T15:11:27.139Z",
                "current_round_loss_id": "288cb694-57f4-4ff8-a0c4-6598166bb4a1",
                "lottoLoss": [
                    {
                        "id": "288cb694-57f4-4ff8-a0c4-6598166bb4a1",
                        "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                        "lotto_name": "หุ้นไทยเย็น",
                        "lotto_bet_type_id": "a3e3e912-0cf5-4413-84c6-037300d3088b",
                        "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "min_max_group": "1_100000_0_c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "max_loss": 100000,
                        "min_loss": 1,
                        "payout_rate": 450,
                        "version": 1,
                        "row_index": 0,
                        "created_at": "2025-05-17T15:11:26.950Z",
                        "deleted_at": null,
                        "updated_at": "2025-05-17T15:11:26.950Z"
                    }
                ]
            },
            {
                "id": "4344e9df-6bdd-4684-9cce-05f2557e1a87",
                "bet_type": "THREE_DIGIT_TOD",
                "bet_type_name": "3 ตัวโต๊ด",
                "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                "bet_digit": 3,
                "min_bet": 1,
                "max_bet": 100000,
                "default_payout": 150,
                "current_payout_rate": 150,
                "is_active": true,
                "is_block": false,
                "version": 1,
                "close_bet_minutes": 30,
                "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                "lotto_name": "หุ้นไทยเย็น",
                "created_at": "2025-05-17T15:11:26.580Z",
                "deleted_at": null,
                "updated_at": "2025-05-17T15:11:27.137Z",
                "current_round_loss_id": "6f53a83b-1ac4-4ee7-8011-e227b2f6f05b",
                "lottoLoss": [
                    {
                        "id": "6f53a83b-1ac4-4ee7-8011-e227b2f6f05b",
                        "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                        "lotto_name": "หุ้นไทยเย็น",
                        "lotto_bet_type_id": "4344e9df-6bdd-4684-9cce-05f2557e1a87",
                        "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "min_max_group": "1_100000_0_c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "max_loss": 100000,
                        "min_loss": 1,
                        "payout_rate": 150,
                        "version": 1,
                        "row_index": 0,
                        "created_at": "2025-05-17T15:11:26.950Z",
                        "deleted_at": null,
                        "updated_at": "2025-05-17T15:11:26.950Z"
                    }
                ]
            }
        ]
    },
    {
        "groupName": "สองตัว",
        "digitGroup": 2,
        "betTypes": [
            {
                "id": "2931d98f-de91-4d9a-a57c-e1266fcb4747",
                "bet_type": "TWO_DIGIT_TOP",
                "bet_type_name": "2 ตัวบน",
                "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                "bet_digit": 2,
                "min_bet": 1,
                "max_bet": 100000,
                "default_payout": 92,
                "current_payout_rate": 92,
                "is_active": true,
                "is_block": false,
                "version": 1,
                "close_bet_minutes": 30,
                "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                "lotto_name": "หุ้นไทยเย็น",
                "created_at": "2025-05-17T15:11:26.580Z",
                "deleted_at": null,
                "updated_at": "2025-05-17T15:11:27.136Z",
                "current_round_loss_id": "ba209d8a-7df1-4cb5-a9cb-a760521efbb5",
                "lottoLoss": [
                    {
                        "id": "ba209d8a-7df1-4cb5-a9cb-a760521efbb5",
                        "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                        "lotto_name": "หุ้นไทยเย็น",
                        "lotto_bet_type_id": "2931d98f-de91-4d9a-a57c-e1266fcb4747",
                        "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "min_max_group": "1_100000_0_c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "max_loss": 100000,
                        "min_loss": 1,
                        "payout_rate": 92,
                        "version": 1,
                        "row_index": 0,
                        "created_at": "2025-05-17T15:11:26.950Z",
                        "deleted_at": null,
                        "updated_at": "2025-05-17T15:11:26.950Z"
                    }
                ]
            },
            {
                "id": "ccf744fb-eaf9-4265-b9be-6b894e975193",
                "bet_type": "TWO_DIGIT_BOTTOM",
                "bet_type_name": "2 ตัวล่าง",
                "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                "bet_digit": 2,
                "min_bet": 1,
                "max_bet": 100000,
                "default_payout": 92,
                "current_payout_rate": 92,
                "is_active": true,
                "is_block": false,
                "version": 1,
                "close_bet_minutes": 30,
                "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                "lotto_name": "หุ้นไทยเย็น",
                "created_at": "2025-05-17T15:11:26.580Z",
                "deleted_at": null,
                "updated_at": "2025-05-17T15:11:27.133Z",
                "current_round_loss_id": "5c58728d-ce3a-49f6-bdd0-ecf4d0ca602c",
                "lottoLoss": [
                    {
                        "id": "5c58728d-ce3a-49f6-bdd0-ecf4d0ca602c",
                        "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                        "lotto_name": "หุ้นไทยเย็น",
                        "lotto_bet_type_id": "ccf744fb-eaf9-4265-b9be-6b894e975193",
                        "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "min_max_group": "1_100000_0_c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "max_loss": 100000,
                        "min_loss": 1,
                        "payout_rate": 92,
                        "version": 1,
                        "row_index": 0,
                        "created_at": "2025-05-17T15:11:26.950Z",
                        "deleted_at": null,
                        "updated_at": "2025-05-17T15:11:26.950Z"
                    }
                ]
            }
        ]
    },
    {
        "groupName": "เลขวิ่ง",
        "digitGroup": 1,
        "betTypes": [
            {
                "id": "2f7038e6-842b-4681-9725-5fe77e81f3a8",
                "bet_type": "ONE_DIGIT_RUN_BOTTOM",
                "bet_type_name": "วิ่งล่าง",
                "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                "bet_digit": 1,
                "min_bet": 1,
                "max_bet": 100000,
                "default_payout": 4.2,
                "current_payout_rate": 4.2,
                "is_active": true,
                "is_block": false,
                "version": 1,
                "close_bet_minutes": 30,
                "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                "lotto_name": "หุ้นไทยเย็น",
                "created_at": "2025-05-17T15:11:26.580Z",
                "deleted_at": null,
                "updated_at": "2025-05-17T15:11:27.131Z",
                "current_round_loss_id": "81e707c9-04cf-4ca6-a01f-42622ee371d8",
                "lottoLoss": [
                    {
                        "id": "81e707c9-04cf-4ca6-a01f-42622ee371d8",
                        "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                        "lotto_name": "หุ้นไทยเย็น",
                        "lotto_bet_type_id": "2f7038e6-842b-4681-9725-5fe77e81f3a8",
                        "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "min_max_group": "1_100000_0_c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "max_loss": 100000,
                        "min_loss": 1,
                        "payout_rate": 4.2,
                        "version": 1,
                        "row_index": 0,
                        "created_at": "2025-05-17T15:11:26.950Z",
                        "deleted_at": null,
                        "updated_at": "2025-05-17T15:11:26.950Z"
                    }
                ]
            },
            {
                "id": "d9912c22-5e97-4498-9904-46a828414395",
                "bet_type": "ONE_DIGIT_RUN_TOP",
                "bet_type_name": "วิ่งบน",
                "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                "bet_digit": 1,
                "min_bet": 1,
                "max_bet": 100000,
                "default_payout": 3.2,
                "current_payout_rate": 3.2,
                "is_active": true,
                "is_block": false,
                "version": 1,
                "close_bet_minutes": 30,
                "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                "lotto_name": "หุ้นไทยเย็น",
                "created_at": "2025-05-17T15:11:26.580Z",
                "deleted_at": null,
                "updated_at": "2025-05-17T15:11:27.155Z",
                "current_round_loss_id": "523b02c2-c462-44a4-b22f-aeda683c18e9",
                "lottoLoss": [
                    {
                        "id": "523b02c2-c462-44a4-b22f-aeda683c18e9",
                        "lotto_id": "6b1511f4-f687-4a8e-870e-17924f64d9ad",
                        "lotto_name": "หุ้นไทยเย็น",
                        "lotto_bet_type_id": "d9912c22-5e97-4498-9904-46a828414395",
                        "lotto_round_id": "c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "min_max_group": "1_100000_0_c3629d2f-9598-4fd5-9954-b8e964a6afdc",
                        "max_loss": 100000,
                        "min_loss": 1,
                        "payout_rate": 3.2,
                        "version": 1,
                        "row_index": 0,
                        "created_at": "2025-05-17T15:11:26.950Z",
                        "deleted_at": null,
                        "updated_at": "2025-05-17T15:11:26.950Z"
                    }
                ]
            }
        ]
    }
]```

