import time

from openai import OpenAI

# CONFIG AND ENV VARIABLES

recipe_list = "Steak Met Potatoes, Hearty Steak and Potatoes, Mozzarella-Crusted Chicken, Winner Winner Chicken Orzo Dinner, Rapid Stir-Fried Beef, Ginger Beef Stir-Fry, Creamy Shrimp Tagliatelle, Balsamic Chicken Rustico, Korean Beef Bibimbap, Lemony Shrimp Risotto, Parmesan-Crusted Cod, Melty Monterey Jack Burger, Meatloaf Balsamico, Perfect Penne Bake, Creamy Dill Chicken, Shrimp and Zucchini Ribbons, Rapid Butternut Squash Agnolotti, Sweet Potato and Black Bean Tacos, Sweet-As-Honey Chicken, Teriyaki Salmon, Jammy Fig and Brie Grilled Cheese, Coconut Chicken Curry, Vegan Spicy Lemon Maple Tofu, Patatas Bravas and Crispy Artichokes."

client = OpenAI()

assistant = client.beta.assistants.create(
    name="SmartTasteAI",
    description="As an assistant for Hello Fresh, your role involves engaging with customers to facilitate their orders. Your task is to suggest four tailored meal options based on a pre-sorted recipe list, reflecting each customer's preferences. If a customer agrees with your suggestions, you'll place the order. If not, offer alternative recipes and gather feedback. Each recipe includes an ingredient list and categories. Keep your communication concise for text-to-speech clarity.",
    # description="You are a gentle and helpful assistant. You will talk to and help my customers place orders on my app and help them choose their items. My app is Hello Fresh, the food/meal delivery app. I want to give my customers a personalized experience even if they have disabilities or difficulties interacting with my app. You will receive a list of available recipes ordered by the probable level of appreciation by the customer. You will kindly talk with the customer, suggesting the four meals that more fit with them. If they accept your proposal, order for them by sending a request to our backend. Otherwise, suggest new recipes and ask for feedback. Every recipe comes with an ingredient list and tags related to categories (Easy, Ethnic, Gourmet, Healthy, High-Calories, Meat, Mild, Pescatarian, Spicy, Traditional, Vegan, Vegetarian) that could be useful to tune the taste and make questions to customers. Keep the text short since it will be read by a text-to-speech tool.",
    model="gpt-4-1106-preview",
)


def create_new_thread(recipes_list_string, user_message):
    new_thread = client.beta.threads.create(
        messages=[
            {
                "role": "user",
                "content": "Here's the list of available recipes:"
            },
            {
                "role": "user",
                "content": recipes_list_string
            },
            {
                "role": "user",
                "content": str("And here's the message from the user: '" + user_message + "'")[:512]
            }
        ]
    )

    return new_thread


def run_thread(thread_id, assistant_id):
    new_run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant_id
    )

    return new_run


if __name__ == '__main__':
    print("Write your message to SmartTasteAI")
    user_first_message = str(input())

    thread = create_new_thread(recipe_list, user_first_message)
    print("Thread ID: " + thread.id)

    run = run_thread(thread.id, assistant.id)
    print("Run ID: " + run.id)

    run_terminated = False
    run_retrieved = None

    while not run_terminated:
        run_retrieved = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )

        if run_retrieved.status == 'completed':
            run_terminated = True
            print("Run completed")
        else:
            #         wait 1 second before checking again
            time.sleep(4)

    print(run_retrieved.id)

    # thread_id = 'thread_zNermBVaFUwMCH3YM5yjWsfj'
    # assistant_id = 'asst_1fTgApVGh02i4As7eFM0C2tA'
    # run_id = 'run_M90Pqnjf4tqpfOnedHMb07yi'

    thread_messages = client.beta.threads.messages.list(thread.id)

    print(thread_messages.data[0].content[0].text.value)

    exit_command = False

    while not exit_command:
        user_new_message = str(input())

        if user_new_message == 'exit':
            exit_command = True
        else:
            new_message = client.beta.threads.messages.create(
                thread_id=thread.id,
                role="user",
                content=user_new_message[:512],
            )

            run = run_thread(thread.id, assistant.id)
            print("Run ID: " + run.id)

            run_terminated = False
            run_retrieved = None

            while not run_terminated:
                run_retrieved = client.beta.threads.runs.retrieve(
                    thread_id=thread.id,
                    run_id=run.id
                )

                if run_retrieved.status == 'completed':
                    run_terminated = True
                    print("Run completed")
                else:
                    #         wait 1 second before checking again
                    time.sleep(1)

            print(run_retrieved.id)

            thread_messages = client.beta.threads.messages.list(thread.id)
            print(thread_messages.data[0].content[0].text.value)
