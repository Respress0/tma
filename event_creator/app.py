from flask import Flask, render_template, request, redirect, flash

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # нужна для flash-сообщений

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        event_name = request.form.get('event_name', '').strip()
        if event_name:
            flash(f"Мероприятие '{event_name}' создано!", 'success')
        else:
            flash("Введите название мероприятия.", 'error')
        return redirect('/')
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
