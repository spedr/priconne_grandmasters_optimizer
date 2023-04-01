import json
import itertools

synergy_dict = {
    "Guardian": [3, 5, 7],
    "Swordmaster": [3, 6],
    "Sorcerer": [3, 5, 7],
    "Shield Master": [2, 4, 6],
    "Assassin": [2, 4, 6],
    "Striker": [3, 5],
    "Healer": [2, 3, 4],   
    "Skill Guard": [2, 3, 4],
    "Boost": [2, 3],
    "Hunter": [2, 4, 6],
    "Ice Dragon": [1],
    "HP Up": [2, 4, 6],
    "TP Recovery": [3, 6],
    "Evasion": [3, 4, 5],
    "Attack Buff": [2, 4, 6],
    "Stun": [2, 4],
    "Invulnerability": [2, 3],
    "Link": [3, 6],
    "Defense Shred": [2, 4, 6],
    "Additional Damage": [3, 6],
    "Attack Speed Up": [2, 4, 6],
    "Nakayoshibu": [3],
    # Let's ignore mirror
    "Fuckmirror": [9]
}

filename = "units.json"

with open(filename, "r") as infile:
    units = json.load(infile)


def get_starting_set(units, required_synergies):
    starting_set = [unit for unit in units if any(synergy in unit['synergies'] for synergy in required_synergies.keys())]
    return starting_set

def get_synergy_count(team, synergy):
    return sum([synergy in unit['synergies'] for unit in team])

def is_valid_team(team, required_synergies, synergy_dict):
    for synergy, required_count in required_synergies.items():
        if get_synergy_count(team, synergy) < required_count:
            return False
        if get_synergy_count(team, synergy) > max(synergy_dict[synergy]):
            return False
    return True

def get_active_synergies(team, synergy_dict):
    active_synergies = {}
    total_score = 0
    for synergy, levels in synergy_dict.items():
        count = get_synergy_count(team, synergy)
        for level in reversed(levels):
            if count >= level:
                active_synergies[synergy] = level
                total_score += level
                break
    return active_synergies, total_score

def generate_teams(units, required_synergies, synergy_dict):
    starting_set = get_starting_set(units, required_synergies)
    teams = []
    for team in itertools.combinations(starting_set, 9):
        if is_valid_team(team, required_synergies, synergy_dict):
            teams.append(team)
    return teams

def get_top_teams(teams, synergy_dict):
    sorted_teams = sorted(teams, key=lambda t: len(get_active_synergies(t, synergy_dict)), reverse=True)
    return sorted_teams

def print_teams(teams, synergy_dict, num_teams):
    scored_teams = [(team, *get_active_synergies(team, synergy_dict)) for team in teams]
    sorted_teams = sorted(scored_teams, key=lambda x: x[2], reverse=True)[:num_teams]

    for i, (team, active_synergies, team_score) in enumerate(sorted_teams):
        print(f"Team {i + 1}: {[unit['name'] for unit in team]}")
        print("Active synergies: ", end="")
        print(', '.join([f"{synergy} {level}" for synergy, level in active_synergies.items()]))
        print(f"Team score: {team_score}")
        print()



required_synergies = {"Guardian": 7, "Defense Shred": 2, "Healer": 2}
teams = generate_teams(units, required_synergies, synergy_dict)
top_teams = get_top_teams(teams, synergy_dict)
print_teams(top_teams, synergy_dict, 20)