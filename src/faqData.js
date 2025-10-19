// src/faqData.js

// ВАЖНО: Пути к изображениям начинаются с /
// Это значит, что они будут браться из папки public.
// Создайте в проекте папку public/images/faq/ и складывайте скриншоты туда.

export const faqData = [
  // --- СТАНДАРТНЫЕ БЛОКИ ---
  {
    category: "Логика",
    blocks: [
      {
        id: "controls_if",
        title: "Блок 'если ... то'",
        image: "/images/faq/controls_if.png",
        description: "Этот блок — основа принятия решений в программе. Он проверяет условие, и если оно истинно (правда), то выполняет действия, вложенные внутрь. Также можно добавить ветку 'иначе' для действий, если условие ложно.",
        inputs: [ { name: "условие (если)", type: "Логическое (Да/Нет)", description: "Сюда подключается блок, который возвращает 'истина' или 'ложь'. Например, блок сравнения чисел (5 > 3)." }, { name: "действие (то)", type: "Любые блоки действий", description: "В эту 'скобку' вставляются блоки, которые должны выполниться, если условие истинно." } ],
        output: { type: "Нет", description: "Этот блок не возвращает никакого значения, он только выполняет действия." },
        example: { text: "Пример: Если количество руды на складе больше 1000, то включить красный фонарь.", image: "/images/faq/controls_if_example.png" },
        code_example: `if (cargoAmount > 1000)\n{\n    light.Color = Color.Red;\n}`
      },
      {
        id: "logic_compare",
        title: "Блок 'сравнение'",
        image: "/images/faq/logic_compare.png",
        description: "Сравнивает два значения (числа, текст и т.д.) и возвращает логический результат: 'истина' (true) или 'ложь' (false).",
        inputs: [ { name: "Первое значение", type: "Любой тип", description: "Значение слева от знака сравнения." }, { name: "Второе значение", type: "Любой тип", description: "Значение справа от знака сравнения." } ],
        output: { type: "Логическое (Да/Нет)", description: "Результат сравнения." },
        example: { text: "Пример: Проверить, равен ли текущий угол ротора 90 градусам.", image: "/images/faq/logic_compare_example.png" },
        code_example: `rotor.Angle == 90;`
      },
       {
        id: "logic_operation",
        title: "Блок 'логическая операция'",
        image: "/images/faq/logic_operation.png",
        description: "Объединяет два логических условия с помощью 'И' (оба должны быть истинны) или 'ИЛИ' (хотя бы одно должно быть истинно).",
        inputs: [ { name: "Первое условие", type: "Логическое (Да/Нет)", description: "Первое условие для проверки." }, { name: "Второе условие", type: "Логическое (Да/Нет)", description: "Второе условие для проверки." } ],
        output: { type: "Логическое (Да/Нет)", description: "Объединенный результат." },
        example: { text: "Пример: Проверить, что батарея заряжена более чем на 90% И солнце светит.", image: "/images/faq/logic_operation_example.png" },
        code_example: `(battery.CurrentStoredPower > 90) && (solar.IsWorking);`
      }
    ]
  },
  {
    category: "Циклы",
    blocks: [
      {
        id: "controls_repeat_ext",
        title: "Блок 'повторить N раз'",
        image: "/images/faq/controls_repeat_ext.png",
        description: "Выполняет вложенные в него действия указанное количество раз. Удобно для повторяющихся операций.",
        inputs: [ { name: "количество раз", type: "Число", description: "Сколько раз нужно выполнить цикл." }, { name: "действия", type: "Любые блоки действий", description: "Действия, которые будут повторяться." } ],
        output: { type: "Нет", description: "Этот блок ничего не возвращает." },
        example: { text: "Пример: 5 раз добавить в очередь сборщика деталь 'SteelPlate'.", image: "/images/faq/controls_repeat_ext_example.png" },
        code_example: `for (int i = 0; i < 5; i++)\n{\n    assembler.AddQueueItem("SteelPlate", 1);\n}`
      }
    ]
  },
  // --- SE БЛОКИ ---
  {
    category: "SE: Общие",
    blocks: [
      {
        id: "se_get_typed_block_by_name",
        title: "Получить блок по имени",
        image: "/images/faq/se_get_typed_block_by_name.png",
        description: "Самый важный блок. Он находит на корабле конкретный блок (поршень, фонарь, контейнер и т.д.) по его точному имени из терминала.",
        inputs: [ { name: "тип блока", type: "Выпадающий список", description: "Выберите тип блока, который вы ищете (например, 'Поршень', 'Фонарь')." }, { name: "имя", type: "Текст", description: "Полное имя блока, как оно написано в терминале игры." } ],
        output: { type: "Блок (IMyTerminalBlock)", description: "Возвращает найденный блок. Если блок не найден, возвращает 'пустоту' (null)." },
        example: { text: "Пример: Найти поршень с именем 'Piston Drill' и сохранить его в переменную 'drillPiston'.", image: "/images/faq/se_get_typed_block_by_name_example.png" },
        code_example: `IMyPistonBase drillPiston = GridTerminalSystem.GetBlockWithName("Piston Drill") as IMyPistonBase;`
      },
      {
        id: "se_is_block_found",
        title: "Блок найден?",
        image: "/images/faq/se_is_block_found.png",
        description: "Проверяет, был ли успешно найден блок. Это критически важно для избежания ошибок в скрипте, если блок был переименован или уничтожен.",
        inputs: [ { name: "блок", type: "Блок (IMyTerminalBlock)", description: "Переменная, в которой хранится блок, полученный ранее." } ],
        output: { type: "Логическое (Да/Нет)", description: "Возвращает 'истина', если блок существует, и 'ложь', если он не был найден." },
        example: { text: "Пример: Перед тем как выдвинуть поршень, проверить, что он вообще был найден.", image: "/images/faq/se_is_block_found_example.png" },
        code_example: `if (drillPiston != null)\n{\n    // ... код для управления поршнем ...\n}`
      },
       {
        id: "se_echo",
        title: "Вывести текст в консоль",
        image: "/images/faq/se_echo.png",
        description: "Выводит любой текст на экран программируемого блока. Очень полезно для отладки и понимания, что происходит в скрипте.",
        inputs: [ { name: "текст", type: "Текст, Число, и т.д.", description: "Информация, которую нужно отобразить." } ],
        output: { type: "Нет", description: "Этот блок ничего не возвращает." },
        example: { text: "Пример: Вывести текущий заряд батареи на экран.", image: "/images/faq/se_echo_example.png" },
        code_example: `Echo("Заряд: " + batteryCharge);`
      },
       {
        id: "se_get_blocks_in_group",
        title: "Получить блоки из группы",
        image: "/images/faq/se_get_blocks_in_group.png",
        description: "Находит все блоки, которые объединены в одну группу в терминале. Это гораздо удобнее, чем получать каждый блок по имени, особенно когда нужно управлять множеством однотипных устройств (например, всеми посадочными шасси или двигателями).",
        inputs: [ { name: "имя группы", type: "Текст", description: "Название группы блоков, как оно задано в терминале." } ],
        output: { type: "Список блоков (List<IMyTerminalBlock>)", description: "Возвращает список, содержащий все найденные блоки. Если группа пуста или не найдена, вернет пустой список." },
        example: { text: "Пример: Получить все посадочные шасси из группы 'Landing Gears' и заблокировать их.", image: "/images/faq/se_get_blocks_in_group_example.png" },
        code_example: `List<IMyLandingGear> landingGears = new List<IMyLandingGear>();\nGridTerminalSystem.GetBlockGroupWithName("Landing Gears").GetBlocksOfType(landingGears);\nforeach(var gear in landingGears) { gear.Lock(); }`
      },
      {
        id: "se_set_enabled",
        title: "Включить / Выключить блок",
        image: "/images/faq/se_set_enabled.png",
        description: "Устанавливает состояние 'Вкл/Выкл' для большинства блоков, у которых есть такая опция в терминале (например, двигатели, сборщики, буры).",
        inputs: [
          { name: "блоки", type: "Блок или Список блоков", description: "Блок или список блоков для переключения." },
          { name: "состояние", type: "Логическое (Да/Нет)", description: "'Истина' для включения, 'Ложь' для выключения." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Выключить все буры, когда контейнеры заполнены.", image: "/images/faq/se_set_enabled_example.png" },
        code_example: `drill.Enabled = false;`
      },
      {
        id: "se_program_argument",
        title: "Аргумент запуска",
        image: "/images/faq/se_program_argument.png",
        description: "Получает текстовый аргумент, с которым был запущен программируемый блок. Позволяет одному скрипту выполнять разные действия в зависимости от того, какая кнопка его вызвала.",
        inputs: [],
        output: { type: "Текст", description: "Текст, введенный в поле 'Аргумент' при запуске." },
        example: { text: "Пример: Если скрипт запущен с аргументом 'open', открыть двери. Если 'close' - закрыть.", image: "/images/faq/se_program_argument_example.png" },
        code_example: `if (argument == "open")\n{\n    door.OpenDoor();\n}`
      },
      {
        id: "se_storage_write",
        title: "Записать в хранилище",
        image: "/images/faq/se_storage_write.png",
        description: "Сохраняет текстовую строку в постоянное хранилище программируемого блока. Эти данные сохраняются даже после перезапуска скрипта или сервера.",
        inputs: [ { name: "текст", type: "Текст", description: "Информация для сохранения." } ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Сохранить текущий режим работы ('mining') в хранилище.", image: "/images/faq/se_storage_write_example.png" },
        code_example: `Storage = "mining";`
      },
      {
        id: "se_storage_read",
        title: "Прочитать из хранилища",
        image: "/images/faq/se_storage_read.png",
        description: "Читает ранее сохраненную текстовую строку из постоянного хранилища программируемого блока.",
        inputs: [],
        output: { type: "Текст", description: "Сохраненная строка." },
        example: { text: "Пример: При запуске скрипта прочитать сохраненный режим работы.", image: "/images/faq/se_storage_read_example.png" },
        code_example: `string savedState = Storage;`
      }
    ]
  },
  {
    category: "SE: Камеры",
    blocks: [
      {
        id: "se_camera_raycast",
        title: "Сканировать камерой",
        image: "/images/faq/se_camera_raycast.png",
        description: "Основной блок для использования камер. Он 'выпускает луч' из камеры на заданное расстояние и возвращает подробную информацию о первом объекте, с которым этот луч столкнулся.",
        inputs: [ { name: "камерой", type: "Блок (IMyCameraBlock)", description: "Сюда нужно подключить блок, который получает конкретную камеру с корабля." }, { name: "просканировать на ... м", type: "Число", description: "Максимальное расстояние сканирования в метрах." }, { name: "тангаж (необязательно)", type: "Число", description: "Вертикальное отклонение луча в градусах (вверх/вниз)." }, { name: "рыскание (необязательно)", type: "Число", description: "Горизонтальное отклонение луча в градусах (вправо/влево)." } ],
        output: { type: "Результат сканирования (MyDetectedEntityInfo)", description: "Возвращает специальный объект с информацией о найденной цели. Это значение нужно передавать в другие блоки камер для анализа." },
        example: { text: "Пример: Взять камеру 'Raycast Camera', просканировать на 5000м и сохранить результат в переменную 'detectedObject'.", image: "/images/faq/se_camera_raycast_example.png" },
        code_example: `MyDetectedEntityInfo detectedObject = CameraRaycastSafe(raycastCamera, 5000, 0, 0);`
      },
      {
        id: "se_camera_raycast_is_valid",
        title: "Результат сканирования валиден?",
        image: "/images/faq/se_camera_raycast_is_valid.png",
        description: "Проверяет, нашел ли луч камеры какой-либо объект. Используется после блока 'сканировать камерой', чтобы убедиться, что мы на что-то смотрим.",
        inputs: [ { name: "результат сканирования", type: "Результат сканирования (MyDetectedEntityInfo)", description: "Переменная, в которой хранится результат работы блока 'сканировать камерой'." } ],
        output: { type: "Логическое (Да/Нет)", description: "Возвращает 'истина', если объект был найден, и 'ложь', если луч ушел в пустоту." },
        example: { text: "Пример: Проверить, было ли что-то найдено при сканировании.", image: "/images/faq/se_camera_raycast_is_valid_example.png" },
        code_example: `if (!detectedObject.IsEmpty())\n{\n    // ... что-то делать с найденным объектом ...\n}`
      },
      {
        id: "se_camera_raycast_get_property",
        title: "Получить свойство найденного объекта",
        image: "/images/faq/se_camera_raycast_get_property.png",
        description: "Получает конкретную информацию из результата сканирования: имя объекта, его скорость, тип, отношение (враг/союзник) и т.д.",
        inputs: [ { name: "из результата сканирования", type: "Результат сканирования (MyDetectedEntityInfo)", description: "Переменная с результатом сканирования." }, { name: "свойство", type: "Выпадающий список", description: "Выберите, какую информацию вы хотите получить." } ],
        output: { type: "Зависит от свойства (Текст, Число, Вектор)", description: "Возвращает запрошенное значение." },
        example: { text: "Пример: Получить имя и скорость объекта, на который смотрит камера.", image: "/images/faq/se_camera_raycast_get_property_example.png" },
        code_example: `string name = detectedObject.Name;\nVector3D velocity = detectedObject.Velocity;`
      }
    ]
  },
  {
    category: "SE: Освещение",
    blocks: [
      {
        id: "se_light_set_color",
        title: "Установить цвет фонаря",
        image: "/images/faq/se_light_set_color.png",
        description: "Меняет цвет свечения для одного или списка фонарей.",
        inputs: [
          { name: "фонари", type: "Блок (IMyLightingBlock) или Список блоков", description: "Фонарь или список фонарей для изменения." },
          { name: "цвет", type: "Цвет", description: "Новый цвет для фонаря." }
        ],
        output: { type: "Нет", description: "Этот блок ничего не возвращает." },
        example: { text: "Пример: Установить для фонаря 'Status Light' зеленый цвет.", image: "/images/faq/se_light_set_color_example.png" },
        code_example: `statusLight.Color = new Color(0, 255, 0);`
      }
    ]
  },
  {
    category: "SE: Механизмы",
    blocks: [
        {
            id: "se_piston_set_velocity",
            title: "Установить скорость поршня",
            image: "/images/faq/se_piston_set_velocity.png",
            description: "Задает скорость движения поршня. Положительное значение - выдвигаться, отрицательное - задвигаться, 0 - остановиться.",
            inputs: [
                { name: "поршни", type: "Блок (IMyPistonBase) или Список", description: "Поршень или список поршней." },
                { name: "скорость", type: "Число", description: "Скорость в м/с. Диапазон обычно от -5 до 5." }
            ],
            output: { type: "Нет", description: "Ничего не возвращает." },
            example: { text: "Пример: Выдвинуть поршень 'Drill Piston' со скоростью 1.5 м/с.", image: "/images/faq/se_piston_set_velocity_example.png" },
            code_example: `drillPiston.Velocity = 1.5f;`
        },
        {
            id: "se_piston_get_position",
            title: "Получить позицию поршня",
            image: "/images/faq/se_piston_get_position.png",
            description: "Возвращает текущее выдвижение поршня в метрах.",
            inputs: [
                { name: "поршень", type: "Блок (IMyPistonBase)", description: "Поршень, чью позицию нужно узнать." }
            ],
            output: { type: "Число", description: "Текущее выдвижение в метрах." },
            example: { text: "Пример: Проверить, полностью ли выдвинут поршень (до 10 метров).", image: "/images/faq/se_piston_get_position_example.png" },
            code_example: `if (drillPiston.CurrentPosition >= 10)\n{\n    // ...\n}`
        },
           {
        id: "se_rotor_set_velocity",
        title: "Установить скорость ротора",
        image: "/images/faq/se_rotor_set_velocity.png",
        description: "Задает скорость вращения ротора в оборотах в минуту (RPM). Положительное значение - по часовой, отрицательное - против.",
        inputs: [
          { name: "роторы", type: "Блок (IMyMotorStator) или Список", description: "Ротор или список роторов." },
          { name: "скорость (RPM)", type: "Число", description: "Скорость вращения." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Медленно вращать ротор солнечной панели со скоростью 0.1 RPM.", image: "/images/faq/se_rotor_set_velocity_example.png" },
        code_example: `solarRotor.TargetVelocityRPM = 0.1f;`
      },
      {
        id: "se_rotor_get_angle",
        title: "Получить угол ротора",
        image: "/images/faq/se_rotor_get_angle.png",
        description: "Возвращает текущий угол поворота ротора в градусах (от 0 до 360).",
        inputs: [ { name: "ротор", type: "Блок (IMyMotorStator)", description: "Ротор, чей угол нужно узнать." } ],
        output: { type: "Число", description: "Текущий угол в градусах." },
        example: { text: "Пример: Остановить ротор, когда его угол достигнет 90 градусов.", image: "/images/faq/se_rotor_get_angle_example.png" },
        code_example: `float angleDegrees = rotor.Angle * (180 / Math.PI);\nif (angleDegrees >= 90) { rotor.TargetVelocityRPM = 0; }`
      },
      {
        id: "se_landing_gear_lock_unlock",
        title: "Заблокировать/Разблокировать шасси",
        image: "/images/faq/se_landing_gear_lock_unlock.png",
        description: "Управляет состоянием посадочного шасси: блокирует (примагничивает) или разблокирует.",
        inputs: [
          { name: "шасси", type: "Блок (IMyLandingGear) или Список", description: "Шасси или список шасси." },
          { name: "действие", type: "Выпадающий список", description: "Выберите Lock, Unlock или Switch Lock." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Заблокировать все посадочные шасси.", image: "/images/faq/se_landing_gear_lock_unlock_example.png" },
        code_example: `gear.Lock();`
      }
    ]
  },
  {
    category: "SE: Дисплеи",
    blocks: [
        {
            id: "se_lcd_write_text",
            title: "Записать текст на дисплей",
            image: "/images/faq/se_lcd_write_text.png",
            description: "Полностью стирает содержимое дисплея и записывает на него новый текст.",
            inputs: [
                { name: "дисплеи", type: "Блок (IMyTextPanel) или Список", description: "Дисплей или список дисплеев." },
                { name: "текст", type: "Текст", description: "Текст для отображения." }
            ],
            output: { type: "Нет", description: "Ничего не возвращает." },
            example: { text: "Пример: Вывести 'Системы в норме' на дисплей 'Status LCD'.", image: "/images/faq/se_lcd_write_text_example.png" },
            code_example: `statusLcd.WriteText("Системы в норме");`
        },
        {
            id: "se_lcd_append_text",
            title: "Добавить текст на дисплей",
            image: "/images/faq/se_lcd_append_text.png",
            description: "Добавляет новый текст в конец того, что уже написано на дисплее. Переносит на новую строку.",
            inputs: [
                { name: "дисплеи", type: "Блок (IMyTextPanel) или Список", description: "Дисплей или список дисплеев." },
                { name: "текст", type: "Текст", description: "Текст для добавления." }
            ],
            output: { type: "Нет", description: "Ничего не возвращает." },
            example: { text: "Пример: Добавить в лог на дисплее запись о текущем заряде батареи.", image: "/images/faq/se_lcd_append_text_example.png" },
            code_example: `logLcd.WriteText("Батарея: " + charge + "%\\n", true);`
        },
        {
        id: "se_lcd_set_font_size",
        title: "Установить размер шрифта дисплея",
        image: "/images/faq/se_lcd_set_font_size.png",
        description: "Изменяет размер шрифта на LCD-панели. Значение 1.0 - стандартный размер.",
        inputs: [
          { name: "дисплеи", type: "Блок (IMyTextPanel) или Список", description: "Дисплей или список дисплеев." },
          { name: "размер", type: "Число", description: "Множитель размера. 0.5 - в два раза меньше, 2.0 - в два раза больше." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Установить крупный шрифт (размер 2.5) для дисплея с предупреждениями.", image: "/images/faq/se_lcd_set_font_size_example.png" },
        code_example: `warningLcd.FontSize = 2.5f;`
      },
      {
        id: "se_lcd_set_color",
        title: "Установить цвет дисплея",
        image: "/images/faq/se_lcd_set_color.png",
        description: "Меняет цвет текста и фона на LCD-панели.",
        inputs: [
          { name: "дисплеи", type: "Блок (IMyTextPanel) или Список", description: "Дисплей или список дисплеев." },
          { name: "цвет текста", type: "Цвет", description: "Новый цвет для текста." },
          { name: "цвет фона", type: "Цвет", description: "Новый цвет для фона." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Установить красный текст на черном фоне для дисплея тревоги.", image: "/images/faq/se_lcd_set_color_example.png" },
        code_example: `alarmLcd.FontColor = Color.Red;\nalarmLcd.BackgroundColor = Color.Black;`
      }
    ]
  },
  {
   category: "SE: Движение",
    blocks: [
      {
        id: "se_thruster_set_override",
        title: "Установить тягу двигателя",
        image: "/images/faq/se_thruster_set_override.png",
        description: "Принудительно устанавливает тягу двигателя в процентах от максимальной. Позволяет управлять кораблем без участия игрока. 0% отключает переопределение.",
        inputs: [
          { name: "двигатели", type: "Блок (IMyThrust) или Список", description: "Двигатель или список двигателей." },
          { name: "% тяги", type: "Число (0-100)", description: "Процент мощности. 50 означает 50% тяги." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Установить все двигатели группы 'Forward Thrusters' на 10% мощности для медленного движения вперед.", image: "/images/faq/se_thruster_set_override_example.png" },
        code_example: `foreach(var thruster in forwardThrusters)\n{\n    thruster.ThrustOverridePercentage = 0.1f;\n}`
      },
      {
        id: "se_gyro_set_override",
        title: "Установить переопределение гироскопа",
        image: "/images/faq/se_gyro_set_override.png",
        description: "Заставляет корабль вращаться с определенной скоростью по осям тангажа (вверх/вниз), рыскания (влево/вправо) и крена (вращение). Основа для любых автопилотов.",
        inputs: [
          { name: "гироскопы", type: "Блок (IMyGyro) или Список", description: "Гироскоп или список гироскопов." },
          { name: "включить", type: "Логическое (Да/Нет)", description: "Включает или выключает режим переопределения." },
          { name: "тангаж/рыскание/крен", type: "Число", description: "Скорость вращения в рад/с. Положительные значения - вверх, вправо, по часовой. Отрицательные - в обратную сторону." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Медленно поворачивать корабль вправо для сканирования местности.", image: "/images/faq/se_gyro_set_override_example.png" },
        code_example: `gyro.GyroOverride = true;\ngyro.Yaw = 0.2f;`
      },
      {
        id: "se_controller_get_gravity",
        title: "Получить вектор гравитации",
        image: "/images/faq/se_controller_get_gravity.png",
        description: "Возвращает 3D вектор, указывающий направление и силу естественной гравитации. Если гравитации нет, вернет нулевой вектор (0,0,0).",
        inputs: [
          { name: "кокпит/контроллер", type: "Блок (IMyShipController)", description: "Любой кокпит, пульт управления или кресло пилота." }
        ],
        output: { type: "3D Вектор (Vector3D)", description: "Вектор гравитации." },
        example: { text: "Пример: Получить вектор гравитации для расчета компенсирующей тяги в скрипте зависания.", image: "/images/faq/se_controller_get_gravity_example.png" },
        code_example: `Vector3D gravityVector = cockpit.GetNaturalGravity();`
      },
         {
        id: "se_controller_get_input",
        title: "Получить вектор управления",
        image: "/images/faq/se_controller_get_input.png",
        description: "Возвращает 3D вектор, отражающий команды управления от игрока (WASD, QE, C, Space). Позволяет скрипту реагировать на действия пилота.",
        inputs: [ { name: "кокпит/контроллер", type: "Блок (IMyShipController)", description: "Кокпит или пульт управления, с которого считываются команды." } ],
        output: { type: "3D Вектор (Vector3D)", description: "Вектор движения. Например, при нажатии W вернет (0,0,-1)." },
        example: { text: "Пример: Если пилот нажимает W, увеличить тягу передних тормозных двигателей.", image: "/images/faq/se_controller_get_input_example.png" },
        code_example: `Vector3D moveIndicator = cockpit.MoveIndicator;`
      }
    ]
  },
  {
    category: "SE: Инвентарь",
    blocks: [
      {
        id: "se_inventory_get_fill_percent",
        title: "Получить % заполненности инвентаря",
        image: "/images/faq/se_inventory_get_fill_percent.png",
        description: "Возвращает процент заполненности инвентаря блока (например, контейнера или бура) от 0 до 100.",
        inputs: [
          { name: "блок", type: "Блок с инвентарем", description: "Любой блок, у которого есть инвентарь." }
        ],
        output: { type: "Число", description: "Процент заполненности (0-100)." },
        example: { text: "Пример: Проверить, заполнен ли контейнер 'Cargo 1' более чем на 90%.", image: "/images/faq/se_inventory_get_fill_percent_example.png" },
        code_example: `float fillPercent = ((float)cargo.GetInventory().CurrentVolume / (float)cargo.GetInventory().MaxVolume) * 100;`
      },
      {
        id: "se_inventory_get_item_amount",
        title: "Получить количество предмета",
        image: "/images/faq/se_inventory_get_item_amount.png",
        description: "Считает, сколько единиц конкретного предмета (руды, компонента, слитка) находится в инвентаре.",
        inputs: [
          { name: "в блоке", type: "Блок с инвентарем", description: "Блок, в котором нужно искать." },
          { name: "тип предмета", type: "Выпадающий список", description: "Категория предмета (Компонент, Слиток, Руда и т.д.)." },
          { name: "подтип предмета", type: "Текст", description: "Точное название предмета, например 'SteelPlate' или 'Iron'." }
        ],
        output: { type: "Число", description: "Количество найденных предметов." },
        example: { text: "Пример: Узнать, сколько железных слитков ('Iron') есть в контейнере.", image: "/images/faq/se_inventory_get_item_amount_example.png" },
        code_example: `MyFixedPoint amount = cargo.GetInventory().GetItemAmount(new MyItemType("MyObjectBuilder_Ingot", "Iron"));`
      }
    ]
  },
  {
    category: "SE: Энергия",
    blocks: [
      {
        id: "se_battery_get_charge",
        title: "Получить % заряда батареи",
        image: "/images/faq/se_battery_get_charge.png",
        description: "Возвращает текущий уровень заряда батареи в процентах от 0 до 100.",
        inputs: [
          { name: "батарея", type: "Блок (IMyBatteryBlock)", description: "Батарея, чей заряд нужно проверить." }
        ],
        output: { type: "Число", description: "Процент заряда (0-100)." },
        example: { text: "Пример: Вывести на дисплей текущий заряд 'Main Battery'.", image: "/images/faq/se_battery_get_charge_example.png" },
        code_example: `float chargePercent = battery.CurrentStoredPower / battery.MaxStoredPower * 100;`
      },
      {
        id: "se_battery_set_charge_mode",
        title: "Установить режим батареи",
        image: "/images/faq/se_battery_set_charge_mode.png",
        description: "Переключает режим работы батареи: зарядка, разрядка, полуавтоматический или перезарядка.",
        inputs: [
          { name: "батареи", type: "Блок (IMyBatteryBlock) или Список", description: "Батарея или список батарей." },
          { name: "режим", type: "Выпадающий список", description: "Выберите нужный режим." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Переключить все батареи в режим 'Разрядка', когда корабль отстыковывается от базы.", image: "/images/faq/se_battery_set_charge_mode_example.png" },
        code_example: `battery.ChargeMode = ChargeMode.Discharge;`
      }
    ]
  },
  {
    category: "SE: Векторы",
    blocks: [
      {
        id: "se_vector_create",
        title: "Создать 3D вектор",
        image: "/images/faq/se_vector_create.png",
        description: "Создает объект 'Vector3D' из трех числовых координат X, Y и Z. Векторы используются для представления позиций, направлений и скоростей в 3D пространстве.",
        inputs: [
          { name: "X", type: "Число", description: "Координата по оси X." },
          { name: "Y", type: "Число", description: "Координата по оси Y." },
          { name: "Z", type: "Число", description: "Координата по оси Z." }
        ],
        output: { type: "3D Вектор (Vector3D)", description: "Созданный вектор." },
        example: { text: "Пример: Создать вектор смещения на 10 метров вверх.", image: "/images/faq/se_vector_create_example.png" },
        code_example: `Vector3D offset = new Vector3D(0, 10, 0);`
      },
      {
        id: "se_vector_math_op",
        title: "Операция с векторами",
        image: "/images/faq/se_vector_math_op.png",
        description: "Выполняет базовые математические операции (сложение, вычитание, умножение, деление) над двумя векторами или вектором и числом.",
        inputs: [
          { name: "вектор А", type: "3D Вектор (Vector3D)", description: "Первый операнд." },
          { name: "операция", type: "Выпадающий список", description: "Выберите математическое действие." },
          { name: "вектор Б или число", type: "3D Вектор или Число", description: "Второй операнд." }
        ],
        output: { type: "3D Вектор (Vector3D)", description: "Результат операции." },
        example: { text: "Пример: Найти вектор направления от позиции корабля к цели (цель - корабль).", image: "/images/faq/se_vector_math_op_example.png" },
        code_example: `Vector3D direction = targetPosition - myPosition;`
      },
      {
        id: "se_vector_distance",
        title: "Расстояние между векторами",
        image: "/images/faq/se_vector_distance.png",
        description: "Вычисляет прямое расстояние в метрах между двумя точками в пространстве, представленными векторами.",
        inputs: [
          { name: "от", type: "3D Вектор (Vector3D)", description: "Первая точка." },
          { name: "до", type: "3D Вектор (Vector3D)", description: "Вторая точка." }
        ],
        output: { type: "Число", description: "Расстояние в метрах." },
        example: { text: "Пример: Узнать расстояние от моего кокпита до GPS-координаты астероида.", image: "/images/faq/se_vector_distance_example.png" },
        code_example: `double distance = Vector3D.Distance(cockpit.GetPosition(), asteroidGps);`
      }
    ]
  },
  {
    category: "SE: Таймеры",
    blocks: [
      {
        id: "se_timer_control",
        title: "Управление таймером",
        image: "/images/faq/se_timer_control.png",
        description: "Позволяет программно запускать, останавливать или вызывать таймер. 'Вызвать сейчас' эквивалентно нажатию кнопки 'Trigger Now' в терминале и немедленно выполняет действия таймера.",
        inputs: [
          { name: "таймеры", type: "Блок (IMyTimerBlock) или Список", description: "Таймер или список таймеров для управления." },
          { name: "действие", type: "Выпадающий список", description: "Выберите действие: Запустить, Остановить, Вызвать сейчас." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Запустить таймер 'Airlock Timer', чтобы начать цикл разгерметизации.", image: "/images/faq/se_timer_control_example.png" },
        code_example: `airlockTimer.StartCountdown();`
      },
      {
        id: "se_timer_set_delay",
        title: "Установить задержку таймера",
        image: "/images/faq/se_timer_set_delay.png",
        description: "Изменяет время задержки таймера в секундах. Полезно для создания динамических задержек в скриптах.",
        inputs: [
          { name: "таймеры", type: "Блок (IMyTimerBlock) или Список", description: "Таймер или список таймеров." },
          { name: "задержка (с)", type: "Число", description: "Новое время задержки в секундах." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Установить задержку для таймера 'Welder Timer' на 5.5 секунд.", image: "/images/faq/se_timer_set_delay_example.png" },
        code_example: `welderTimer.TriggerDelay = 5.5f;`
      }
    ]
  },
  {
    category: "SE: Сенсоры",
    blocks: [
      {
        id: "se_sensor_get_last_detected",
        title: "Получить последний объект из сенсора",
        image: "/images/faq/se_sensor_get_last_detected.png",
        description: "Возвращает информацию о последнем объекте, который активировал сенсор. Данные имеют тот же формат, что и у камеры (MyDetectedEntityInfo), что позволяет использовать с ними те же блоки анализа.",
        inputs: [
          { name: "сенсор", type: "Блок (IMySensorBlock)", description: "Сенсор, с которого нужно получить данные." }
        ],
        output: { type: "Результат сканирования (MyDetectedEntityInfo)", description: "Информация об обнаруженном объекте." },
        example: { text: "Пример: Получить информацию о корабле, который только что влетел в зону сенсора у ворот ангара.", image: "/images/faq/se_sensor_get_last_detected_example.png" },
        code_example: `MyDetectedEntityInfo entity = hangarSensor.LastDetectedEntity;`
      },
      {
        id: "se_entity_info_is_empty",
        title: "Информация об объекте пуста?",
        image: "/images/faq/se_entity_info_is_empty.png",
        description: "Проверяет, содержит ли переменная с информацией об объекте (полученная от сенсора или камеры) какие-либо данные. По сути, это проверка 'видит ли сенсор что-нибудь?'.",
        inputs: [
          { name: "информация об объекте", type: "Результат сканирования (MyDetectedEntityInfo)", description: "Переменная для проверки." }
        ],
        output: { type: "Логическое (Да/Нет)", description: "Возвращает 'истина', если объект не обнаружен." },
        example: { text: "Пример: Проверить, есть ли в зоне сенсора какой-либо объект, прежде чем закрывать дверь.", image: "/images/faq/se_entity_info_is_empty_example.png" },
        code_example: `if (!entity.IsEmpty())\n{\n    // Объект найден\n}`
      }
    ]
  },
  {
    category: "SE: Оружие",
    blocks: [
      {
        id: "se_weapon_shoot_toggle",
        title: "Включить/выключить стрельбу",
        image: "/images/faq/se_weapon_shoot_toggle.png",
        description: "Включает или выключает непрерывную стрельбу для выбранного оружия или турели. Полезно для создания автоматических защитных систем.",
        inputs: [
          { name: "оружие", type: "Блок (IMyUserControllableGun) или Список", description: "Оружие или список оружия." },
          { name: "действие", type: "Выпадающий список", description: "Включить или выключить стрельбу." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Включить все гатлинг-турели, когда сенсор обнаруживает врага.", image: "/images/faq/se_weapon_shoot_toggle_example.png" },
        code_example: `gatlingTurret.ApplyAction("Shoot_On");`
      },
      {
        id: "se_weapon_shoot_once",
        title: "Выстрелить один раз",
        image: "/images/faq/se_weapon_shoot_once.png",
        description: "Заставляет оружие произвести один выстрел. Идеально подходит для ракетниц, артиллерии и другого оружия с низкой скорострельностью.",
        inputs: [
          { name: "оружие", type: "Блок (IMyUserControllableGun) или Список", description: "Оружие или список оружия." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Сделать одиночный выстрел из ракетницы по цели, когда она в зоне поражения.", image: "/images/faq/se_weapon_shoot_once_example.png" },
        code_example: `rocketLauncher.ApplyAction("ShootOnce");`
      },
          {
        id: "se_weapon_is_shooting",
        title: "Оружие стреляет?",
        image: "/images/faq/se_weapon_is_shooting.png",
        description: "Проверяет, ведет ли оружие или турель огонь в данный момент.",
        inputs: [ { name: "оружие", type: "Блок (IMyUserControllableGun)", description: "Оружие для проверки." } ],
        output: { type: "Логическое (Да/Нет)", description: "Возвращает 'истина', если оружие стреляет." },
        example: { text: "Пример: Включить красный фонарь, пока турели ведут огонь.", image: "/images/faq/se_weapon_is_shooting_example.png" },
        code_example: `if (gatlingTurret.IsShooting) { light.Enabled = true; }`
      }
    ]
  },
  {
    category: "SE: Производство",
    blocks: [
      {
        id: "se_assembler_add_to_queue",
        title: "Добавить в очередь сборщика",
        image: "/images/faq/se_assembler_add_to_queue.png",
        description: "Добавляет указанное количество определенного компонента в очередь производства сборщика.",
        inputs: [
          { name: "сборщики", type: "Блок (IMyAssembler) или Список", description: "Сборщик или список сборщиков." },
          { name: "количество", type: "Число", description: "Сколько единиц компонента нужно произвести." },
          { name: "компонент", type: "Выпадающий список", description: "Выберите компонент из списка." }
        ],
        output: { type: "Нет", description: "Ничего не возвращает." },
        example: { text: "Пример: Заказать производство 100 Стальных пластин в главном сборщике.", image: "/images/faq/se_assembler_add_to_queue_example.png" },
        code_example: `MyDefinitionId definition = MyDefinitionId.Parse("MyObjectBuilder_Component/SteelPlate");\nassembler.AddQueueItem(definition, 100);`
      },
      {
        id: "se_production_is_working",
        title: "Блок работает? (Производство)",
        image: "/images/faq/se_production_is_working.png",
        description: "Проверяет, активен ли в данный момент производственный блок (сборщик, переработчик). Позволяет отслеживать завершение производственных циклов.",
        inputs: [
          { name: "блок", type: "Блок (IMyProductionBlock)", description: "Сборщик или переработчик." }
        ],
        output: { type: "Логическое (Да/Нет)", description: "Возвращает 'истина', если блок сейчас что-то производит." },
        example: { text: "Пример: Выключить сигнальный фонарь, когда сборщик закончит свою работу.", image: "/images/faq/se_production_is_working_example.png" },
        code_example: `if (!assembler.IsWorking)\n{\n    light.Enabled = false;\n}`
      }
    ]
  },

];