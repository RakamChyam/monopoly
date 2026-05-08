const treasuryActions = [
    {
        number: 3,
        type: "get_money",
        value: 50,
        discription: "Получите 50$."
    },
    {
        number: 4,
        type: "pay_money",
        value: 50,
        discription: "Визит к врачу. Заплатите 50$.",
    },
    {
        number: 5,
        type: "get_money",
        value: 100,
        discription: "Отпускные. Получите 100$.",
    },
    {
        number: 6,
        type: "get_money",
        value: 100,
        discription: "Выплата по страховке. Получите 100$.",
    },
    {
        number: 7,
        type: "pay_money",
        value: 50,
        discription: "Взнос за учебу. Заплатите 50$.",
    },
    {
        number: 8,
        type: "get_money",
        value: 20,
        discription: "Возмещение подоходного налога. Получите 20$.",
    },
    {
        number: 9,
        type: "pay_money",
        value: 100,
        discription: "Заплатите за лечение в больнице 100$.",
    },
    {
        number: 10,
        type: "go_to_field",
        value: 0,
        discription: "Отправляйтесь в тюрьму и не получайте 200$ за круг.",
    },
    {
        number: 11,
        type: "get_money",
        value: 25,
        discription: "Получите 25$ за консалтинговые услуги."
    },
    {
        number: 12,
        type: "get_money",
        value: 10,
        discription: "С днем рождения! Получите по 10$ от каждого игрока."
    },
    {
        number: 13,
        type: "get_money",
        value: 100,
        discription: "Вы получили в наследство 100$."
    },
    {
        number: 14,
        type: "get_money",
        value: 50,
        discription: "Вы заработали на продаже акций 50$."
    },
    {
        number: 15,
        type: "get_money",
        value: 50,
        discription: "Вы заняли второе место на конкурсе красоты. Получите 10$."
    },
    {
        number: 16,
        type: "repair",
        value: [40, 115],
        discription: "Ремонт прилегающей территории. Заплатите 40$ за каждый дом, 115$ за каждый отель."
    },
    {
        number: 17,
        type: "go_to_field",
        value: 200,
        discription: "Идите на поле «ВПЕРЕД». Получите 200$.",
    },
    {
        number: 18,
        type: "get_money",
        value: 200,
        discription: "Банковская ошибка в вашу пользу. Получите 200$."
    },
]

export default treasuryActions;